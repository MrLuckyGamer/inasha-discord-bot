const https = require("https");

/**
 * Fetches a random GIF/image + metadata from the nekos.best API.
 * Docs: https://docs.nekos.best/
 *
 * @param {string} category - e.g. "kiss", "hug", "slap", "pat", "cuddle"
 * @returns {Promise<{ url: string, anime_name?: string }>}
 */
function fetchNekosBest(category) {
  const options = {
    hostname: "nekos.best",
    path: `/api/v2/${category}`,
    method: "GET",
    headers: {
      // nekos.best asks consumers to identify themselves
      "User-Agent": "Inasha-Discord-Bot/1.0 (https://github.com/)",
      Accept: "application/json",
    },
    timeout: 5000,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume(); // drain so the socket can close cleanly
        return reject(new Error(`nekos.best returned status ${res.statusCode}`));
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const result = json && json.results && json.results[0];
          if (result && result.url) {
            resolve(result);
          } else {
            reject(new Error("Malformed response from nekos.best"));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("timeout", () => req.destroy(new Error("Request to nekos.best timed out")));
    req.on("error", reject);
    req.end();
  });
}

module.exports = { fetchNekosBest };
