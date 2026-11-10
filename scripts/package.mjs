#!/usr/bin/env node
// Builds dist/<name>.zip for every skills/<name>/ folder. The zip's ROOT entry
// is the folder itself (<name>/SKILL.md, not SKILL.md at the top level) because
// that is what claude.ai's Customize > Skills > Upload a skill requires. Never
// build these by hand — this script is the only thing that produces dist/.

import { readdirSync, statSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const distDir = join(root, "dist");

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}
mkdirSync(distDir, { recursive: true });

const skillNames = readdirSync(skillsDir).filter((e) =>
  statSync(join(skillsDir, e)).isDirectory()
);

if (skillNames.length === 0) {
  console.error("package.mjs: no skill folders found under skills/");
  process.exit(1);
}

for (const name of skillNames) {
  const zipPath = join(distDir, `${name}.zip`);
  // -X: strip extra file attributes (no macOS resource forks / Finder junk).
  // -r: recurse. Run from inside skills/ so the zip root entry is "<name>/".
  const result = spawnSync("zip", ["-r", "-X", zipPath, name], {
    cwd: skillsDir,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`package.mjs: zip failed for ${name} (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
  console.log(`package.mjs: wrote ${zipPath}`);
}

console.log(`package.mjs: done, ${skillNames.length} zip(s) in dist/`);
