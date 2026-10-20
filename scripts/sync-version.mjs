// Copies package.json's version into the integration manifest, so HACS and the panel's cache-buster agree.
import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const path = "custom_components/smartnest_pro/manifest.json";
const manifest = JSON.parse(readFileSync(path, "utf8"));
if (manifest.version !== pkg.version) {
  manifest.version = pkg.version;
  writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
}
