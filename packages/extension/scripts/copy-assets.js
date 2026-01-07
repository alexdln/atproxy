/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const copyFile = (src, dest) => {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
};

const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
};

const distDir = path.join(__dirname, "../dist");
const srcDir = path.join(__dirname, "../src");

if (fs.existsSync(path.join(srcDir, "popup.html"))) {
    copyFile(path.join(srcDir, "popup.html"), path.join(distDir, "popup.html"));
}

if (fs.existsSync(path.join(srcDir, "manifest.json"))) {
    copyFile(path.join(srcDir, "manifest.json"), path.join(distDir, "manifest.json"));
}

if (fs.existsSync(path.join(srcDir, "icons"))) {
    copyDir(path.join(srcDir, "icons"), path.join(distDir, "icons"));
}
