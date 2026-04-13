import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log('Starting Veluxe server...');
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString(), env: process.env.NODE_ENV });
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

  // Serve static files or use Vite dev server
  const distPath = path.join(process.cwd(), 'dist');
  let distExists = false;
  try {
    await fs.access(distPath);
    distExists = true;
    console.log('Dist folder found.');
  } catch (e) {
    console.log('Dist folder not found.');
  }

  // If dist exists, we serve it (Production-ready)
  if (distExists) {
    console.log('Serving static files from dist...');
    app.use(express.static(distPath));
    
    // SPA Fallback: Send index.html for any unknown routes
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Fallback to Vite Dev Server if dist is missing
    console.log('Using Vite middleware (Development mode)');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Veluxe server is live on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Critical server startup error:', err);
});
