export default async function handler(req, res) {
  // **תיקון CORS משופר:**
  const origin = req.headers.origin;
  
  // רשימת דומיינים מורשים (הוסף את הדומיין של Base44 שלך)
  const allowedOrigins = [
    'https://qtrypzzcjebvfcihiynt.supabase.co', // הדומיין של Base44
    'http://localhost:3000', // לפיתוח מקומי
    'http://localhost:5173', // לפיתוח מקומי (Vite)
  ];
  
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // טיפול בבקשות OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const API_BASE_URL = "https://www.matara.pro/nedarimplus/Mechubad/Reports/ManageReports.aspx";

    const action = req.query.action || "GetClient_Table";
    
    const paramsData = {
      Action: action,
      MosadId: process.env.NED_USER,
      ApiPassword: process.env.NED_PASS,
      ...req.query 
    };
    
    delete paramsData.action; 

    const queryParams = new URLSearchParams(paramsData).toString();
    const FULL_API_URL = `${API_BASE_URL}?${queryParams}`; 

    const response = await fetch(FULL_API_URL, {
      method: "GET",
    });

    const text = await response.text();
    
    try {
        const jsonResponse = JSON.parse(text);
        return res.status(response.status).json(jsonResponse);
    } catch (parseError) {
        return res.status(response.status).send(text);
    }

  } catch (err) {
    console.error("Proxy Error:", err);
    return res.status(500).json({
      error: "Proxy request failed",
      details: err.message
    });
  }
}
