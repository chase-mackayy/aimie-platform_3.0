const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_CONNECTION_ID = process.env.TELNYX_CONNECTION_ID;

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
    // Search for available Australian numbers with voice capability
    const searchRes = await fetch(
      'https://api.telnyx.com/v2/available_phone_numbers?country_code=AU&features=voice&limit=1',
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

    // Order the number
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
      console.error('Telnyx number order failed:', await orderRes.text());
      // Return the found number even if ordering failed — can be retried
      return phoneNumber;
    }

    const orderData = await orderRes.json();
    return orderData.data?.phone_numbers?.[0]?.phone_number ?? phoneNumber;
  } catch (err) {
    console.error('Telnyx provisioning error:', err);
    return null;
  }
}
