/* Controlador de temas — carga dinámica de los CSS de tema procesados por Vite
   Requisitos:
   - Tus archivos de tema deben estar en /src/themes/*.css (o ajusta la glob más abajo).
   - Cada tema CSS debe usar selectores basados en data-theme, por ejemplo:
       html[data-theme="red-raicing"] { --color-bg: ... }
   - Las imágenes referenciadas desde los CSS deben usarse con rutas relativas
     (por ejemplo: url('../assets/bg.png')) para que Vite las procese.
   - Reemplaza las importaciones estáticas de themes en main.js por este controlador.

   Usa: importa este módulo desde tu main.js (si no lo haces ya).
*/

import { themeList } from "./themes.js"; // ajusta la ruta si tu themes.js está en otra carpeta

const modalColors = document.querySelector(".theme-modal__colors");
const modal = document.querySelector(".theme-modal");
const buttonModal = document.querySelector(".theme");

let previewTimeout = null;

// ----------------- CARGA DINÁMICA DE LOS CSS DE TEMA -----------------
// Usamos import.meta.glob para obtener la URL final que Vite genera
// (incluye hashes en producción). La ruta absoluta '/src/themes/*.css'
// funciona con Vite desde la raíz del proyecto.
const themeFiles = import.meta.glob("/src/themes/*.css", {
  as: "url",
  eager: true,
});

const themeMap = {};
for (const p in themeFiles) {
  const m = p.match(/\/([^\/]+)\.css$/);
  if (m) themeMap[m[1]] = themeFiles[p]; // name -> url
}

// ----------------- UTILIDADES -----------------
const parseName = (name) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getSavedTheme = () => localStorage.getItem("theme") || "";

// Asegura que exista un <link id="theme-link"> en el head y lo devuelve
function ensureThemeLink() {
  let link = document.getElementById("theme-link");
  if (!link) {
    link = document.createElement("link");
    link.id = "theme-link";
    link.rel = "stylesheet";
    // Insertar después de los estilos base para que pueda sobrescribirlos
    document.head.appendChild(link);
  }
  return link;
}

// Aplica el CSS del tema indicado (cambia href del <link>)
function loadThemeCss(name) {
  const href = themeMap[name];
  if (!href) return false;
  const link = ensureThemeLink();
  link.href = href;
  return true;
}

// ----------------- PREVIEW y APPLY -----------------
function previewTheme(name) {
  // debounce / delay para evitar flicker con movimientos rápidos
  if (previewTimeout) clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    if (themeMap[name]) {
      loadThemeCss(name);
      document.documentElement.setAttribute("data-theme", name);
      document.documentElement.setAttribute("data-preview", "true");
    }
  }, 150);
}

function applyTheme(name) {
  if (previewTimeout) {
    clearTimeout(previewTimeout);
    previewTimeout = null;
  }
  if (themeMap[name]) {
    loadThemeCss(name);
    document.documentElement.setAttribute("data-theme", name);
    document.documentElement.setAttribute("data-preview", "false");
    localStorage.setItem("theme", name);
  } else {
    // Si no existe CSS en themeMap, solo seteamos data-theme para temas que
    // dependan únicamente de variables ya incluidas de otra forma.
    document.documentElement.setAttribute("data-theme", name);
    document.documentElement.setAttribute("data-preview", "false");
    localStorage.setItem("theme", name);
  }
}

function restoreSavedTheme() {
  const saved = getSavedTheme();
  if (saved && themeMap[saved]) {
    loadThemeCss(saved);
    document.documentElement.setAttribute("data-theme", saved);
  } else if (saved) {
    // Si el CSS no existe en build (edge case), igual restauramos atributo
    document.documentElement.setAttribute("data-theme", saved);
  }
}

// ----------------- UI: creación de los elementos del modal -----------------
const createPalette = () => {
  const palette = document.createElement("div");
  palette.className = "theme__palette";
  for (let i = 0; i < 3; i++) {
    const c = document.createElement("div");
    c.className = "theme__color";
    palette.appendChild(c);
  }
  return palette;
};

export const createColorUi = (theme) => {
  const colorBox = document.createElement("div");
  colorBox.className = "theme-modal__color";
  colorBox.dataset.theme = theme.name;
  colorBox.setAttribute("role", "button");
  colorBox.setAttribute("tabindex", "0");
  colorBox.setAttribute("aria-label", `Tema ${parseName(theme.name)}`);

  const nameDiv = document.createElement("div");
  nameDiv.className = "theme-modal__name";
  nameDiv.textContent = parseName(theme.name);

  const pal = createPalette();
  colorBox.appendChild(nameDiv);
  colorBox.appendChild(pal);

  return colorBox;
};

// Construir la UI con la lista de themes (themeList viene de themes.js)
themeList.forEach((t) => {
  const ui = createColorUi(t);
  modalColors.appendChild(ui);
});

// ----------------- EVENTOS: preview, selección y accesibilidad -----------------
let lastHovered = null;

// Pointer events para preview (más fiables que mouseover/mouseout)
modalColors.addEventListener(
  "pointerenter",
  (e) => {
    const box = e.target.closest(".theme-modal__color");
    if (!box) return;
    if (box === lastHovered) return;
    lastHovered = box;
    previewTheme(box.dataset.theme);
  },
  { capture: true }
);

modalColors.addEventListener(
  "pointerleave",
  (e) => {
    // Si nos movemos a otra caja, no restauramos aquí (el pointerenter de la otra caja lo hará).
    const related = e.relatedTarget;
    if (related && related.closest && related.closest(".theme-modal__color"))
      return;

    if (previewTimeout) {
      clearTimeout(previewTimeout);
      previewTimeout = null;
    }
    // restaurar tema guardado
    const saved = getSavedTheme();
    if (saved) {
      if (themeMap[saved]) loadThemeCss(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    document.documentElement.setAttribute("data-preview", "false");
    lastHovered = null;
  },
  { capture: true }
);

// Click para aplicar
modalColors.addEventListener("click", (e) => {
  const box = e.target.closest(".theme-modal__color");
  if (!box) return;
  const name = box.dataset.theme;
  if (name && name !== getSavedTheme()) applyTheme(name);
});

// Teclado para accesibilidad: Enter/Space aplica; arrows navegan
modalColors.addEventListener("keydown", (e) => {
  const box = e.target.closest(".theme-modal__color");
  if (!box) return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const name = box.dataset.theme;
    if (name && name !== getSavedTheme()) applyTheme(name);
    return;
  }

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    const next = box.nextElementSibling || modalColors.firstElementChild;
    next && next.focus();
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    const prev = box.previousElementSibling || modalColors.lastElementChild;
    prev && prev.focus();
  }
});

// ----------------- Modal open/close (click fuera) -----------------
buttonModal.setAttribute("aria-controls", modal.id || "theme-modal");
buttonModal.setAttribute("aria-expanded", "false");

document.body.addEventListener("click", (e) => {
  // ABRIR MODAL
  if (buttonModal.contains(e.target)) {
    modal.classList.add("theme-modal--visible");
    buttonModal.setAttribute("aria-expanded", "true");
    // Focus en primer item
    const first = modal.querySelector(".theme-modal__color");
    first && first.focus();
    return;
  }

  // CLICK DENTRO DEL MODAL
  if (modal.contains(e.target)) {
    return; // no cerrar
  }

  // CLICK FUERA → CERRAR
  if (modal.classList.contains("theme-modal--visible")) {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
      previewTimeout = null;
    }
    const saved = getSavedTheme();
    if (saved) {
      if (themeMap[saved]) loadThemeCss(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    document.documentElement.setAttribute("data-preview", "false");
    lastHovered = null;

    requestAnimationFrame(() => {
      modal.classList.remove("theme-modal--visible");
      buttonModal.setAttribute("aria-expanded", "false");
    });
  }
});

// ----------------- INIT: restaurar tema guardado al cargar -----------------
restoreSavedTheme();

// Exportar funciones por si otros módulos las necesitan
export {
  previewTheme as previewThemeByName,
  applyTheme as applyThemeByName,
  restoreSavedTheme,
};
