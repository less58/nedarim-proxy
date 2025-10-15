export default async function handler(req, res) {
  // **כותרות CORS - חשוב מאוד!**
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight למשך 24 שעות
  
  // **טיפול בבקשת OPTIONS (preflight) - קריטי!**
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";

    // קבלת action מ-query parameters
    const action = req.query.action || "GetClient_Table";
    
    // בניית פרמטרים לשליחה ל-API של נדרים קארד
    const paramsData = {
      Action: action,
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      ...req.query
    };
    
    // הסרת action מהפרמטרים (כבר הוספנו אותו כ-Action)
    delete paramsData.action;

    // בניית query string
    const queryParams = new URLSearchParams(paramsData).toString();
    const FULL_API_URL = `${API_BASE_URL}?${queryParams}`;

    console.log('Requesting:', FULL_API_URL);

    // שליחת בקשה ל-API של נדרים קארד
    const response = await fetch(FULL_API_URL, {
      method: "GET",
    });

    const text = await response.text();
    console.log('Response:', text);
    
    // ניסיון לפרסר JSON
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
