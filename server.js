const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const multer = require("multer");

const app = express();
const PORT = 4000;

console.log("CWD:", process.cwd());

// 📂 Directorios
const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(process.cwd(), "uploads");

// 📁 Crear uploads si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta uploads creada");
}

// 🌐 Archivos estáticos
app.use(express.static(publicDir));
app.use("/uploads", express.static(uploadsDir));

// ==============================
// 📤 CONFIGURAR MULTER
// ==============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo imágenes"));
    }
    cb(null, true);
  }
});

// ==============================
// 📤 RUTA UPLOAD
// ==============================

app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se subió ningún archivo");
  }

  console.log("📸 Imagen subida:", req.file.filename);

  // Volver al upload
  res.redirect("/");
});

// ==============================
// 🖼️ API IMÁGENES
// ==============================

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

// ==============================
// 🧪 TEST
// ==============================

app.get("/test", (req, res) => {
  res.send("Servidor OK");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "upload.html"));
});

// ==============================
// 🚀 SERVER
// ==============================

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en:
→ http://localhost:${PORT}
→ http://IP_DE_TU_PC:${PORT}`);
});

process.stdin.resume();
