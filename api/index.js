export default async function handler(req, res) {
  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";
    const { query } = req; // הסרת 'method' כי הוא פחות רלוונטי ל-GET

    // בניית פרמטרים מדויקים (אנו נשתמש במבנה הזה לבניית URLSearchParams)
    const paramsData = {
      Action: query.action || "GetClient_Table",
      MosadId: process.env.NED_USER,     // מזהה מוסד
      ApiPassword: process.env.NED_PASS, // סיסמה ל-API
      ...(query || {})                   // מאפשר פרמטרים נוספים אם יש
    };
    
    // יצירת מחרוזת פרמטרים בפורמט URL
    const queryParams = new URLSearchParams(paramsData).toString();

    // בניית ה-URL המלא לבקשת GET
    const FULL_API_URL = `${API_BASE_URL}?${queryParams}`; 

    const response = await fetch(FULL_API_URL, {
      method: "GET", // *** שינוי קריטי: מעבר מ-POST ל-GET ***
      // הסרת headers ו-body שאינם נדרשים ב-GET
    });

    const text = await response.text();
    res.status(response.status).send(text);

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({
      error: "Proxy request failed",
      details: err.message
    });
  }
}
