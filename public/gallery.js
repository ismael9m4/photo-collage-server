const photo = document.getElementById("photo");
const frame = document.getElementById("frame");
const emptyMessage = document.getElementById("empty-message");

let images = [];
let currentIndex = 0;
let rotationTimer = null;

const ROTATION_TIME = 5000; // 5 segundos
const REFRESH_TIME = 4000;  // chequear nuevas fotos

// ==============================
// CARGAR IMÁGENES
// ==============================

async function fetchImages() {
  try {
    const res = await fetch("/api/images");
    const data = await res.json();

    if (data.length === 0) {
      emptyMessage.style.display = "block";
      photo.style.display = "none";
      frame.style.display = "none";
      images = [];
      return;
    }

    emptyMessage.style.display = "none";
    photo.style.display = "block";
    frame.style.display = "block";

    // Si hay nuevas imágenes
    if (data.join() !== images.join()) {
      images = data;
      if (currentIndex >= images.length) currentIndex = 0;
      showImage(currentIndex);
      restartRotation();
    }

  } catch (err) {
    console.error("Error actualizando galería:", err);
  }
}

// ==============================
// MOSTRAR IMAGEN
// ==============================

function showImage(index) {
  if (!images.length) return;

  photo.style.opacity = 0;

  setTimeout(() => {
    currentIndex = index;
    photo.src = images[currentIndex];
  }, 300);
}

// ==============================
// ORIENTACIÓN + MARCO
// ==============================

photo.onload = () => {
  photo.style.opacity = 1;

  const isHorizontal = photo.naturalWidth >= photo.naturalHeight;

  frame.style.backgroundImage = isHorizontal
    ? "url('/img/frame-horizontal.png')"
    : "url('/img/frame-vertical.png')";
};

// ==============================
// ROTACIÓN AUTOMÁTICA
// ==============================

function nextImage() {
  if (!images.length) return;
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function restartRotation() {
  clearInterval(rotationTimer);
  rotationTimer = setInterval(nextImage, ROTATION_TIME);
}

// ==============================
// TECLADO
// ==============================

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }
});

// ==============================
// INICIO
// ==============================

fetchImages();
restartRotation();
setInterval(fetchImages, REFRESH_TIME);
