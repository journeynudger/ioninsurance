// Stand-in for Resend and a webhook. /resend and /hook record and return 200, /fail 500, /slow never answers.
import http from "node:http";
import fs from "node:fs";
const log = process.argv[2];
http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/slow") return;
    fs.appendFileSync(log, JSON.stringify({ url: req.url, headers: req.headers, body }) + "\n");
    if (req.url === "/fail") { res.writeHead(500); return res.end("nope"); }
    res.writeHead(200, { "content-type": "application/json" }); res.end('{"id":"mock"}');
  });
}).listen(4999);
