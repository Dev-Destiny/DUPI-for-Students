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
    const content = fs.readFileSync(file, "utf8");
    // Match import or export statements with relative paths
    // Example: import { foo } from "./foo"; or export * from "../bar";
    const regex = /(import|export)[\s\S]*?from\s+["'](\.[^"']+)["']/g;
    
    let modified = false;
    const newContent = content.replace(regex, (match, p1, p2) => {
        // p2 is the path e.g. "./config/env"
        if (!p2.endsWith(".js") && !p2.endsWith(".json")) {
            modified = true;
            return match.replace(p2, p2 + ".js");
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(file, newContent, "utf8");
        changedFiles++;
    }
});

console.log(`Updated imports in ${changedFiles} files.`);
