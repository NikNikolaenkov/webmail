#!/usr/bin/env node
// Fork report: keys of locales/en/common.json that are missing in locales/uk/common.json,
// and uk values identical to en (untranslated copies). Never fails the build — exit 0 always.
// Usage: node scripts/i18n/uk-missing.mjs [--json]
import { readFileSync } from "node:fs";

const read = (l) => JSON.parse(readFileSync(new URL(`../../locales/${l}/common.json`, import.meta.url), "utf8"));

/** Flattens nested objects/arrays into "a.b.0" → string leaf values. */
function flatten(value, prefix = "", out = new Map()) {
  if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.set(prefix, value);
  }
  return out;
}

function compare(en, uk) {
  const e = flatten(en), u = flatten(uk);
  const missing = [], same = [];
  for (const [k, v] of e) {
    if (!u.has(k)) missing.push(k);
    else if (typeof v === "string" && v.trim() !== "" && u.get(k) === v) same.push(k);
  }
  return { total: e.size, missing, same };
}

{
  const r = compare(read("en"), read("uk"));
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`uk: ${r.total} en keys, missing ${r.missing.length}, same as en ${r.same.length}`);
    for (const k of r.missing) console.log(`  missing  ${k}`);
    for (const k of r.same) console.log(`  same     ${k}`);
  }
}
