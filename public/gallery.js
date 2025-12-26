const photo = document.getElementById("photo");
const frame = document.getElementById("frame");
const container = document.getElementById("photo-container");
const emptyMessage = document.getElementById("empty-message");

let images = [];
let index = 0;
let timer = null;

const FRAMES = {
  horizontal: {
    img: "/img/frame-horizontal.png",
    padding: "8%"
  },
  vertical: {
    img: "/img/frame-vertical.png",
    padding: "10%"
  }
};

// ==============================
// CARGAR IMÁGENES
// ==============================
fetch("/api/images")
  .then(r => r.json())
  .then(data => {
    images = data;

    if (images.length === 0) {
      emptyMessage.style.display = "block";
      return;
    }

    emptyMessage.style.display = "none";
    showImage(0);
    startAuto();
  })
  .catch(err => {
    console.error(err);
    emptyMessage.style.display = "block";
  });

// ==============================
// MOSTRAR IMAGEN
// ==============================
function showImage(i) {
  photo.style.opacity = 0;

  setTimeout(() => {
    index = i;
    photo.src = images[index];
  }, 400);
}

// ==============================
// CUANDO CARGA LA FOTO
// ==============================
photo.onload = () => {
  photo.style.opacity = 1;

  const isHorizontal = photo.naturalWidth >= photo.naturalHeight;
  const type = isHorizontal ? "horizontal" : "vertical";

  frame.style.backgroundImage = `url(${FRAMES[type].img})`;
  container.style.padding = FRAMES[type].padding;
};

// ==============================
// AUTO ROTACIÓN
// ==============================
function startAuto() {
  clearInterval(timer);
  timer = setInterval(next, 5000);
}

function next() {
  showImage((index + 1) % images.length);
}

function prev() {
  showImage((index - 1 + images.length) % images.length);
}

// ==============================
// TECLADO
// ==============================
document.addEventListener("keydown", e => {
  if (!images.length) return;

  if (e.key === "ArrowRight") {
    next();
    startAuto();
  }

  if (e.key === "ArrowLeft") {
    prev();
    startAuto();
  }
});
