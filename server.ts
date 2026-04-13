import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Logging middleware
  app.use(async (req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    console.log(log.trim());
    try {
      await fs.appendFile(path.join(process.cwd(), 'server.log'), log);
    } catch (e) {}
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      time: new Date().toISOString()
    });
  });

  app.get("/api/products", async (req, res) => {
    try {
      const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
      const data = await fs.readFile(productsPath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Failed to load products' });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
      await fs.writeFile(productsPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save products' });
    }
  });

  // Serve static files if dist exists, otherwise use Vite
  const distPath = path.resolve(process.cwd(), 'dist');
  let useStatic = false;
  try {
    await fs.access(path.join(distPath, 'index.html'));
    useStatic = true;
  } catch (e) {}

  if (useStatic) {
    console.log('Serving from dist folder');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('Serving via Vite middleware');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Veluxe Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
});
