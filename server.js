const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");

const app = express();
const PORT = 4000;

// 🔎 Mostrar desde dónde se ejecuta Node
console.log("CWD:", process.cwd());

// 📂 Rutas
const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(process.cwd(), "uploads");

// 📁 Crear carpeta uploads si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta uploads creada");
}

// 🌐 Servir archivos estáticos
app.use(express.static(publicDir));
app.use("/uploads", express.static(uploadsDir));

// 🧪 Ruta de prueba
app.get("/test", (req, res) => {
  res.send("Servidor OK");
});

// 🖼️ API: listar imágenes subidas
app.get("/api/images", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Error leyendo uploads:", err);
      return res.json([]);
    }

    const images = files
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map(f => `/uploads/${f}`);

    res.json(images);
  });
});

// 🚀 Crear servidor HTTP explícito (evita problemas en Windows)
const server = http.createServer(app);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});

// 🧷 Mantener proceso vivo en tu entorno
process.stdin.resume();
