import { themeList } from "./themes.js";

const modalColors = document.querySelector(".theme-modal__colors");
const modal = document.querySelector(".theme-modal");
const buttonModal = document.querySelector(".theme");

let lastHovered = null;
let previewTimeout;

const palleteColor = () => {
  const palette = document.createElement("div");
  palette.classList.add("theme__palette");

  for (let i = 0; i < 3; i++) {
    const color = document.createElement("div");
    color.classList.add("theme__color");
    palette.appendChild(color);
  }

  return palette;
};

const parseName = (name) => {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const createColorUi = (theme) => {
  const colorBox = document.createElement("div");
  colorBox.classList.add("theme-modal__color");
  colorBox.dataset.theme = theme.name;

  const nameDiv = document.createElement("div");
  nameDiv.classList.add("theme-modal__name");
  nameDiv.textContent = parseName(theme.name);

  const pallete = palleteColor(theme);
  colorBox.appendChild(nameDiv);
  colorBox.appendChild(pallete);

  return colorBox;
};

const getTheme = () => {
  return localStorage.getItem("theme") || "";
};

const previewTheme = (theme) => {
  //* limpia el timeout anterior
  clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-preview", "true");
  }, 500);
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-preview", "false");

  localStorage.setItem("theme", theme);
};

themeList.forEach((theme) => {
  const colorUi = createColorUi(theme);
  modalColors.appendChild(colorUi);
});

modalColors.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("theme-modal__color")) {
    const divColor = e.target.closest(".theme-modal__color");
    if (!divColor || divColor === lastHovered) return;
    lastHovered = divColor;

    previewTheme(divColor.dataset.theme);
  }
});

// modalColors.addEventListener("mouseout", (e) => {
//   if (e.target.classList.contains("theme-modal__color")) {
//     const divColor = e.target.closest(".theme-modal__color");
//     if (lastHovered) lastHovered = null;
//     clearTimeout(previewTimeout);
//     const currentTheme = localStorage.getItem("theme") || "";

//     if (divColor.dataset.preview === "true") {
//     }

//     document.documentElement.setAttribute("data-theme", currentTheme);
//   }
// });

document.body.addEventListener("click", (e) => {
  // ABRIR MODAL
  if (buttonModal.contains(e.target)) {
    modal.classList.add("theme-modal--visible");
    return;
  }

  // CLICK DENTRO DEL MODAL
  if (modal.contains(e.target)) {
    const color = e.target.closest(".theme-modal__color");

    if (color && color.dataset.theme !== getTheme()) {
      applyTheme(color.dataset.theme);
    }

    return; // ⛔️ NO CERRAR
  }

  // CLICK FUERA → CERRAR
  if (modal.classList.contains("theme-modal--visible")) {
    clearInterval(previewTimeout);

    document.documentElement.setAttribute("data-preview", "false");
    document.documentElement.setAttribute("data-theme", getTheme());

    lastHovered = null;

    requestAnimationFrame(() => {
      modal.classList.remove("theme-modal--visible");
    });
  }
});
