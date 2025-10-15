export default async function handler(req, res) {
  const { method, body, query } = req;
  const path = query.path || "";
  const response = await fetch(`https://api.nedarimcard.com/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from(process.env.NED_USER + ":" + process.env.NED_PASS).toString("base64")
    },
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  res.status(response.status).send(text);
}
