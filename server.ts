import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
