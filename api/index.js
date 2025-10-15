export default async function handler(req, res) {
  try {
    const API_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";

    // קבלת נתונים מהקריאה שמגיעה מה-Frontend (Base44)
    const { method, body, query } = req;

    // הגדרה גמישה: ניתן לשלוח Action ופרמטרים נוספים
    // לדוגמה: ?action=GetClient_Table&FromDate=2024-01-01
    const params = new URLSearchParams();

    // Action ברירת מחדל אם לא נשלח
    params.append("Action", query.action || body.Action || "GetClient_Table");

    // חובה לפי ההגדרה שלך
    params.append("MosadId", process.env.NED_USER);
    params.append("ApiPassword", process.env.NED_PASS);

    // כל פרמטר נוסף שהגיע מה-Frontend (למשל תאריכים, מזהים וכו')
    const extraParams = { ...query, ...body };
    for (const key in extraParams) {
      if (!["Action"].includes(key)) {
        params.append(key, extraParams[key]);
      }
    }

    // שליחת הבקשה ל-API של נדרים
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    // קבלת תשובה
    const text = await response.text();

    // החזרה ללקוח (Base44)
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed", details: err.message });
  }
}
