export default async function handler(req, res) {
  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";

    // **תיקון 1:** משיכת הנתונים מ-req.query (פרמטרים ב-URL)
    const action = req.query.action || "GetClient_Table";
    
    // יצירת אובייקט עם פרמטרי ברירת המחדל
    const paramsData = {
      Action: action,
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      // **תיקון 2:** שלב את כל שאר פרמטרי ה-URL (req.query)
      ...req.query 
    };
    
    // הסר פרמטרים שאינם צריכים להישלח לשרת החיצוני
    delete paramsData.action; 

    // יצירת מחרוזת פרמטרים בפורמט URL
    const queryParams = new URLSearchParams(paramsData).toString();

    // בניית ה-URL המלא לבקשת GET
    const FULL_API_URL = `${API_BASE_URL}?${queryParams}`; 

    // **תיקון 3:** שימוש בשיטת GET כפי שנדרש בתיעוד ("APIGET")
    const response = await fetch(FULL_API_URL, {
      method: "GET",
    });

    const text = await response.text();
    
    // ניסיון לפרסר JSON, אם לא מצליח, שולח טקסט גולמי
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
