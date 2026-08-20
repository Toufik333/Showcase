const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");

// When using `output: "standalone"`, Next.js generates a minimal server at
// `.next/standalone/server.js`.  On Namecheap (Phusion Passenger) the PORT env
// var is assigned dynamically — we must respect it.

const dev = process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";
const port = process.env.PORT || 3000;

let app;
if (dev) {
  // In development, use the standard next() initializer
  const next = require("next");
  app = next({ dev });
  app.prepare().then(() => {
    const handle = app.getRequestHandler();
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, () => {
      console.log(`> Next.js Dev Server Ready on port ${port}`);
    });
  });
} else {
  // In production with standalone output, load the Next.js standalone server
  const next = require("next");
  app = next({ dev: false });
  app.prepare().then(() => {
    const handle = app.getRequestHandler();
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, () => {
      console.log(`> Next.js Server Ready on port ${port}`);
    });
  });
}
