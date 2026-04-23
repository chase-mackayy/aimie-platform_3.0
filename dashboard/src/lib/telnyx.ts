const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_CONNECTION_ID = process.env.TELNYX_CONNECTION_ID; // FQDN connection → LiveKit SIP

export async function provisionAustralianNumber(): Promise<string | null> {
  if (!TELNYX_API_KEY) {
    console.warn('TELNYX_API_KEY not set — skipping number provisioning');
    return null;
  }

  const headers = {
    Authorization: `Bearer ${TELNYX_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Search for available Australian mobile/local numbers with voice capability
    const searchRes = await fetch(
      'https://api.telnyx.com/v2/available_phone_numbers?country_code=AU&features=voice&number_type=local&limit=5',
      { headers }
    );

    if (!searchRes.ok) {
      console.error('Telnyx number search failed:', await searchRes.text());
      return null;
    }

    const searchData = await searchRes.json();
    const phoneNumber = searchData.data?.[0]?.phone_number;
    if (!phoneNumber) {
      console.error('No Australian numbers available from Telnyx');
      return null;
    }

    // 2. Order the number and assign to our SIP connection immediately
    const orderBody: Record<string, unknown> = {
      phone_numbers: [{ phone_number: phoneNumber }],
    };
    if (TELNYX_CONNECTION_ID) {
      orderBody.connection_id = TELNYX_CONNECTION_ID;
    }

    const orderRes = await fetch('https://api.telnyx.com/v2/phone_numbers/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderBody),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      console.error('Telnyx number order failed:', errText);
      return phoneNumber; // Return number anyway, order can be retried
    }

    const orderData = await orderRes.json();
    const provisionedNumber = orderData.data?.phone_numbers?.[0]?.phone_number ?? phoneNumber;

    // 3. Add to LiveKit SIP inbound trunk so calls route to Amy
    await addToLiveKitTrunk(provisionedNumber).catch((e) =>
      console.error('LiveKit trunk update failed (non-fatal):', e)
    );

    return provisionedNumber;
  } catch (err) {
    console.error('Telnyx provisioning error:', err);
    return null;
  }
}

async function addToLiveKitTrunk(phoneNumber: string): Promise<void> {
  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const trunkId = process.env.LIVEKIT_SIP_TRUNK_ID;

  if (!url || !apiKey || !apiSecret || !trunkId) {
    console.warn('LiveKit credentials not set — skipping trunk update');
    return;
  }

  try {
    const { AccessToken } = await import('livekit-server-sdk');
    const token = new AccessToken(apiKey, apiSecret, { identity: 'server' });
    const jwt = await token.toJwt();

    // Get current trunk to read existing numbers
    const httpUrl = url.replace('wss://', 'https://').replace('ws://', 'http://');
    const getRes = await fetch(`${httpUrl}/twirp/livekit.SIP/GetSIPInboundTrunk`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sip_trunk_id: trunkId }),
    });

    if (!getRes.ok) return;
    const trunk = await getRes.json();
    const existingNumbers: string[] = trunk.numbers ?? [];

    if (existingNumbers.includes(phoneNumber)) return; // already there

    // Update trunk with new number added
    await fetch(`${httpUrl}/twirp/livekit.SIP/UpdateSIPInboundTrunk`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sip_trunk_id: trunkId,
        trunk: { numbers: [...existingNumbers, phoneNumber] },
      }),
    });

    console.log(`Added ${phoneNumber} to LiveKit trunk ${trunkId}`);
  } catch (err) {
    console.error('LiveKit trunk update error:', err);
  }
}
