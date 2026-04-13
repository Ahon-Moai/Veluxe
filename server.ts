import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/products", (req, res) => {
  try {
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const data = fs.readFileSync(productsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    fs.writeFileSync(productsPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save products' });
  }
});

// Serve static files from dist
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

