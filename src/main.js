import "./js/utils.js";
import "./js/fadeAnimation.js";
import "./js/background-stars.js";
import "./js/mouse-events.js";
import "./js/theme/theme-controller.js";

import { addNavBlur } from "./js/utils.js";

// --- Inicio: carga dinámica de themes (usa import.meta.glob) ---
const themeFiles = import.meta.glob("./themes/*.css", {
  as: "url",
  eager: true,
});

// Construir mapa name -> url (p. ej. 'dune' -> '/Portafolio/assets/dune-xxxxx.css')
const themeMap = {};
for (const path in themeFiles) {
  const m = path.match(/\/([^\/]+)\.css$/);
  if (m) {
    const name = m[1]; // extrae el nombre del fichero (sin extensión)
    themeMap[name] = themeFiles[path];
  }
}

// Aplica un tema creando o reemplazando un <link id="theme-link">
function applyTheme(name) {
  const href = themeMap[name];
  if (!href) {
    console.warn("Tema no encontrado:", name);
    return;
  }

  // Quitar link anterior si existe
  const prev = document.getElementById("theme-link");
  if (prev) prev.remove();

  const link = document.createElement("link");
  link.id = "theme-link";
  link.rel = "stylesheet";
  link.href = href; // URL ya contiene la ruta final con hash
  document.head.appendChild(link);

  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("theme", name);
}

// Aplicar tema guardado o fallback
const saved = localStorage.getItem("theme") || "default-theme-name";
if (saved && themeMap[saved]) {
  applyTheme(saved);
} else {
  // si no hay saved, intenta aplicar el primer theme disponible
  const first = Object.keys(themeMap)[0];
  if (first) applyTheme(first);
}

applyTheme();

addNavBlur();

(function () {
  document.body.style.visibility = "visible";
})();
