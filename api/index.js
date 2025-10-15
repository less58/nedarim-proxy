export default async function handler(req, res) {
  try {
    const { method, query, body } = req;

    // ניצור אובייקט של פרמטרים משולבים
    const params = {
      Action: query.action || (body && body.Action) || "GetClient_Table",
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      // נשלב כל פרמטר נוסף שהגיע בבקשה
      ...(body || {}),
      ...(query || {})
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
