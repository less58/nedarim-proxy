export default async function handler(req, res) {
  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";
    // *** שינוי: קבלת פרמטרים מ-body של בקשת POST אם מגיעה בקשת POST לשרת הביניים שלך ***
    // אם אתה מתכוון שהאפליקציה ב-base44 תשלח POST לשרת הביניים, אז קבל כך:
    const { action, params } = req.body; 
    // אם האפליקציה ב-base44 עדיין תשלח GET לשרת הביניים עם query params, אז:
    // const { query } = req;
    // const action = query.action;
    // const params = query.params ? JSON.parse(query.params) : {}; // אם הפרמטרים מועברים כמחרוזת JSON בתוך query param

    const paramsData = {
      Action: action || req.query.Action, // ודא שאתה מקבל את ה Action בצורה נכונה
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      ...(params || req.query) // שלב פרמטרים נוספים מ-body או מ-query
    };

    // *** שינוי קריטי: שליחת בקשת POST לנדרים קארד ***
    const formData = new URLSearchParams(paramsData).toString(); // יוצר פורמט URL-encoded

    const response = await fetch(API_BASE_URL, {
      method: "POST", // *** שינוי: שיטת POST ***
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // *** שינוי: כותרת Content-Type ***
      },
      body: formData // *** שינוי: גוף הבקשה ***
    });

    const text = await response.text();
    // Vercel handles JSON responses, assuming nedarim API returns valid JSON usually.
    // If it returns text, you might need to try JSON.parse(text) or handle text directly.
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
