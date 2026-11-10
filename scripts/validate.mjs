#!/usr/bin/env node
// Validates every skills/<name>/SKILL.md against the rules this repo enforces
// before a release, plus that the two plugin manifests parse as JSON.
// Exits non-zero on any failure; prints every failure found, not just the first.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");

const failures = [];
function fail(msg) {
  failures.push(msg);
}

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FORBIDDEN_NAME_SUBSTRINGS = ["claude", "anthropic"];
const XML_TAG_RE = /<\/?[a-zA-Z][^>]*>/;

function readFrontmatter(skillMdPath) {
  const raw = readFileSync(skillMdPath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    fail(`${skillMdPath}: no YAML frontmatter block found (must open and close with "---")`);
    return null;
  }
  try {
    const parsed = parseYaml(match[1]);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      fail(`${skillMdPath}: frontmatter did not parse to a YAML mapping`);
      return null;
    }
    return parsed;
  } catch (err) {
    fail(`${skillMdPath}: frontmatter is not valid YAML: ${err.message}`);
    return null;
  }
}

function validateSkill(skillDirName) {
  const skillDir = join(skillsDir, skillDirName);
  const skillMdPath = join(skillDir, "SKILL.md");

  if (!existsSync(skillMdPath)) {
    fail(`${skillDir}: missing SKILL.md`);
    return;
  }

  const fm = readFrontmatter(skillMdPath);
  if (!fm) return;

  // name
  if (typeof fm.name !== "string" || fm.name.length === 0) {
    fail(`${skillMdPath}: frontmatter "name" is missing or empty`);
  } else {
    if (fm.name.length > 64) {
      fail(`${skillMdPath}: "name" is ${fm.name.length} characters, max 64`);
    }
    if (!NAME_RE.test(fm.name)) {
      fail(`${skillMdPath}: "name" (${fm.name}) must contain only lowercase letters, digits and hyphens`);
    }
    const lowered = fm.name.toLowerCase();
    for (const bad of FORBIDDEN_NAME_SUBSTRINGS) {
      if (lowered.includes(bad)) {
        fail(`${skillMdPath}: "name" (${fm.name}) must not contain "${bad}"`);
      }
    }
    if (fm.name !== skillDirName) {
      fail(`${skillMdPath}: "name" (${fm.name}) must equal the folder name (${skillDirName})`);
    }
  }

  // description
  if (typeof fm.description !== "string" || fm.description.trim().length === 0) {
    fail(`${skillMdPath}: frontmatter "description" is missing or empty`);
  } else {
    if (fm.description.length > 1024) {
      fail(`${skillMdPath}: "description" is ${fm.description.length} characters, max 1024`);
    }
    if (XML_TAG_RE.test(fm.description)) {
      fail(`${skillMdPath}: "description" must not contain XML/HTML tags`);
    }
  }
}

function validateJsonFile(relPath) {
  const path = join(root, relPath);
  if (!existsSync(path)) {
    fail(`${relPath}: file missing`);
    return;
  }
  try {
    JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    fail(`${relPath}: does not parse as JSON: ${err.message}`);
  }
}

if (!existsSync(skillsDir)) {
  fail(`${skillsDir}: skills/ directory missing`);
} else {
  const entries = readdirSync(skillsDir).filter((e) => statSync(join(skillsDir, e)).isDirectory());
  if (entries.length === 0) {
    fail(`${skillsDir}: no skill folders found`);
  }
  for (const entry of entries) {
    validateSkill(entry);
  }
}

validateJsonFile(".claude-plugin/marketplace.json");
validateJsonFile(".claude-plugin/plugin.json");

if (failures.length > 0) {
  console.error(`validate.mjs: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("validate.mjs: all skills and manifests valid.");
process.exit(0);
