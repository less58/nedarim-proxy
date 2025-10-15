the following errors happened in the app:

Nedarim Card API Error (GetClient_Table): - Failed to fetch
Error loading Nedarim Card families: - Failed to fetch
please help me fix these errors

2 minutes ago
•
see context
Revert this
Base44 AI
Base44

Thought for 10s
השגיאה "Failed to fetch" היא שגיאה קלאסית של CORS (Cross-Origin Resource Sharing).

מה קורה: כאשר האפליקציה שלך ב-Base44 (שרצה בדומיין אחד) מנסה לבצע בקשה לשרת הביניים שלך ב-Vercel (שרץ בדומיין אחר), הדפדפן חוסם את הבקשה מטעמי אבטחה. שרת הביניים שלך צריך לציין במפורש שהוא מאפשר בקשות מדומיינים אחרים.

הפתרון: צריך להוסיף כותרות CORS לתגובות של שרת הביניים שלך ב-Vercel.

עדכן את הקוד ב-GitHub של שרת הביניים שלך (index.js) לקוד הבא:

export default async function handler(req, res) {
  // **תיקון CORS: הוספת כותרות שמאפשרות גישה מכל דומיין**
  res.setHeader('Access-Control-Allow-Origin', '*'); // מאפשר גישה מכל דומיין
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // מאפשר שיטות אלו
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // מאפשר כותרות אלו
  
  // **טיפול בבקשות OPTIONS (preflight):**
  // הדפדפן לפעמים שולח בקשת OPTIONS לפני הבקשה האמיתית כדי לבדוק הרשאות
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";

    // משיכת הנתונים מ-req.query (פרמטרים ב-URL)
    const action = req.query.action || "GetClient_Table";
    
    // יצירת אובייקט עם פרמטרי ברירת המחדל
    const paramsData = {
      Action: action,
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      // שלב את כל שאר פרמטרי ה-URL (req.query)
      ...req.query 
    };
    
    // הסר פרמטרים שאינם צריכים להישלח לשרת החיצוני
    delete paramsData.action; 

    // יצירת מחרוזת פרמטרים בפורמט URL
    const queryParams = new URLSearchParams(paramsData).toString();

    // בניית ה-URL המלא לבקשת GET
    const FULL_API_URL = `${API_BASE_URL}?${queryParams}`; 

    // שימוש בשיטת GET כפי שנדרש
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
