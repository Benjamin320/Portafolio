const fs = require("fs");
const path = require("path");
const dist = path.resolve(__dirname, "..", "dist");
const from = path.join(dist, "index.html");
const to = path.join(dist, "404.html");

if (fs.existsSync(from)) {
  fs.copyFileSync(from, to);
  console.log("404.html creado");
} else {
  console.warn(
    "No se encontró dist/index.html — ejecuta npm run build primero"
  );
}
