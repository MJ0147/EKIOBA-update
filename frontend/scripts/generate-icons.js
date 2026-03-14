const sharp = require("sharp");
const fs = require("fs");

const sizes = [48, 72, 96, 128, 192, 256, 512];
const src = "assets/logo.png"; // your high-res source image
const outDir = "public/icons";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

sizes.forEach((size) => {
  sharp(src)
    .resize(size, size)
    .toFile(`${outDir}/icon-${size}.png`)
    .then(() => console.log(`Generated icon-${size}.png`))
    .catch((err) => console.error(err));
});
