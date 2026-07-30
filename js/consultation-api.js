const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbwNAlHNUx374Qk6fKSdLZ2JZSw1lEOJS7yG3CJzoiHV1hlCR3FIcvN6mEJNC3M_MoRx2Q/exec"
};

/**
 * Submits consultation data to Google Apps Script Web App.
 *
 * CORS approach:
 *   - Uses normal fetch (no mode:"no-cors").
 *   - Content-Type: text/plain;charset=UTF-8 makes this a "simple request"
 *     (no CORS preflight), so the browser sends it directly.
 *   - If the GAS Web App returns Access-Control-Allow-Origin headers
 *     (which it does when deployed as "Anyone"), the response is readable.
 *   - If the browser blocks the response due to missing CORS headers,
 *     fetch will reject with a TypeError — catch block handles it.
 *
 *   If CORS proves to be a blocker, switch to mode:"no-cors" but note:
 *   the server response becomes invisible to JavaScript.
 */
export async function submitConsultation(data) {
  const payload = {
    fullName: data.fullName.trim(),
    phone: data.phoneNumber.trim(),
    email: data.emailAddress.trim(),
    interestedIn: data.serviceInterest || ""
  };

  console.log("Submitting to:", CONFIG.API_URL);
  console.log("Payload:", payload);

  const response = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    },
    body: JSON.stringify(payload)
  });

  console.log("Response Status:", response.status);

  const responseText = await response.text();
  console.log("Response Body:", responseText);

  let result;
  try {
    result = JSON.parse(responseText);
  } catch (parseError) {
    throw new Error(`Unexpected server response: ${responseText}`);
  }

  if (!response.ok || !result.success) {
    const errorMsg = result.message || result.error || `Server error (${response.status})`;
    throw new Error(errorMsg);
  }

  return { success: true };
}
