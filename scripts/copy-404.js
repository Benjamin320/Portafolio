import { copyFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const dist = resolve(".", "dist");
const from = join(dist, "index.html");
const to = join(dist, "404.html");

if (existsSync(from)) {
  copyFileSync(from, to);
  console.log("404.html creado");
} else {
  console.warn(
    "No se encontró dist/index.html — ejecuta npm run build primero"
  );
}
