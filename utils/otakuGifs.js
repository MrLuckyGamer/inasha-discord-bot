const https = require("https");

/**
 * Fetches a random GIF URL from the otakugifs.xyz API.
 * Docs: https://otakugifs.xyz/documentation
 *
 * @param {string} reaction - e.g. "kiss", "hug", "slap", "pat", "cuddle"
 * @param {string} [format="gif"] - "gif", "webp", or "avif"
 * @returns {Promise<{ url: string }>}
 */
function fetchOtakuGif(reaction, format = "gif") {
  const options = {
    hostname: "api.otakugifs.xyz",
    path: `/gif?reaction=${encodeURIComponent(reaction)}&format=${encodeURIComponent(format)}`,
    method: "GET",
    headers: {
      "User-Agent": "Inasha-Discord-Bot/1.0 (https://github.com/)",
      Accept: "application/json",
    },
    timeout: 5000,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume(); // drain so the socket can close cleanly
        return reject(new Error(`otakugifs.xyz returned status ${res.statusCode}`));
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json && json.url) {
            resolve(json);
          } else {
            reject(new Error("Malformed response from otakugifs.xyz"));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("timeout", () => req.destroy(new Error("Request to otakugifs.xyz timed out")));
    req.on("error", reject);
    req.end();
  });
}

module.exports = { fetchOtakuGif };
