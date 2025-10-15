export default async function handler(req, res) {
  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";
    
    // ודא שהקוד מקבל את ה-action וה-params מ-req.body
    const { action, params } = req.body;
    
    if (!action) {
        return res.status(400).json({ error: "Missing 'action' parameter in body" });
    }

    const paramsData = {
      Action: action,
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      ...(params || {}) // שלב פרמטרים נוספים מ-body
    };

    const formData = new URLSearchParams(paramsData).toString();

    const response = await fetch(API_BASE_URL, {
      method: "POST", 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const text = await response.text();
    try {
        const jsonResponse = JSON.parse(text);
        res.status(response.status).json(jsonResponse);
    } catch (parseError) {
        res.status(response.status).send(text);
    }

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({
      error: "Proxy request failed",
      details: err.message
    });
  }
}
