export default async function handler(req, res) {
  try {
    const { method, query } = req;

    // בניית פרמטרים מדויקים לפי דרישות נדרים
    const params = {
      Action: query.action || "GetClient_Table",
      MosadId: process.env.NED_USER,     // מזהה מוסד
      ApiPassword: process.env.NED_PASS, // סיסמה ל-API
      ...(query || {})                   // מאפשר פרמטרים נוספים אם יש
    };

    const response = await fetch("https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
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
