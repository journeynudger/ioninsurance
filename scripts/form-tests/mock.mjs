// Stand-in for Resend, Airtable and a webhook. Every path records and returns 200, except /fail… (500) and /slow (never answers).
import http from "node:http";
import fs from "node:fs";
const log = process.argv[2];
http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/slow") return;
    fs.appendFileSync(log, JSON.stringify({ url: req.url, headers: req.headers, body }) + "\n");
    if (req.url.startsWith("/fail")) { res.writeHead(500); return res.end("nope"); }
    res.writeHead(200, { "content-type": "application/json" }); res.end('{"id":"mock"}');
  });
}).listen(4999);
