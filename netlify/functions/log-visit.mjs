import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  const ip = event.headers["x-nf-client-connection-ip"] || "unknown";

  let country = "XX";
  if (ip && ip !== "unknown") {
    try {
      const res = await fetch(`https://ipwho.is/${ip}`);
      const data = await res.json();
      country = data.country_code || "XX";
    } catch {
      /* offline/geo failure → skip silently */
    }
  }

  const store = getStore({ name: "visits" });
  const current = (await store.getJSON("countries")) ?? {};
  current[country] = (current[country] || 0) + 1;
  await store.setJSON("countries", current);

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};