import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log('Starting server initialization...');
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // API Routes
  console.log('Registering API routes...');
  app.get("/api/products", async (req, res) => {
    try {
      const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
      const data = await fs.readFile(productsPath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error('Error reading products:', error);
      res.status(500).json({ error: 'Failed to load products' });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
      await fs.writeFile(productsPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving products:', error);
      res.status(500).json({ error: 'Failed to save products' });
    }
  });

  const isProduction = process.env.NODE_ENV === "production";
  console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

  if (!isProduction) {
    console.log('Initializing Vite middleware...');
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          host: '0.0.0.0',
          port: 3000
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log('Vite middleware initialized.');
    } catch (e) {
      console.error('Failed to initialize Vite middleware:', e);
    }
  } else {
    console.log('Serving static files from dist...');
    const distPath = path.join(process.cwd(), 'dist');
    // Check if dist exists
    try {
      await fs.access(distPath);
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } catch (e) {
      console.error('Dist folder not found! Falling back to Vite dev server.');
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          host: '0.0.0.0',
          port: 3000
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on 0.0.0.0:${PORT}`);
  });
}

startServer();
