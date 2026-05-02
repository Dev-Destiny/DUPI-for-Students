import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "src");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith(".ts")) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, "utf8");
    let modified = false;

    // Fix directory imports that were wrongly appended with .js instead of /index.js
    const incorrectImports = [
        "../types.js",
        "./types.js",
        "../middlewares.js",
        "./middlewares.js",
        "../routes.js",
        "./routes.js",
        "../schemas.js",
        "./schemas.js",
        "../utils.js",
        "./utils.js",
        "../lib.js",
        "./lib.js",
    ];

    incorrectImports.forEach(incorrect => {
        if (content.includes(incorrect)) {
            const correct = incorrect.replace(".js", "/index.js");
            // use regex to replace within quotes
            const regex = new RegExp(`['"]${incorrect}['"]`, "g");
            content = content.replace(regex, `"${correct}"`);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(file, content, "utf8");
        changedFiles++;
    }
});

console.log(`Fixed index imports in ${changedFiles} files.`);
