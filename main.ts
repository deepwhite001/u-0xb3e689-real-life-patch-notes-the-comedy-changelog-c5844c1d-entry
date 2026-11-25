// Real-Life Patch Notes: The Comedy Changelog
// Writes one single-line patch note (<= 160 chars) to $MAKEFUN_OUTPUT_DIR/entry.txt
// (defaults to /output). No network, no randomness, no temp files in the repo.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 160;

const ENTRY =
  "v2.0.1: fixed a bug where walking into a room deleted the reason you went there; memory is now restored on exit.";

const here = dirname(fileURLToPath(import.meta.url));
void here;

function main(): void {
  const line = ENTRY.trim();
  if (!line) {
    throw new Error("entry is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (/\r|\n/.test(line)) {
    throw new Error("entry must be a single line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the gate counts every character in the file.
  writeFileSync(outPath, line, "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    throw new Error("written entry does not match the intended line");
  }
}

main();
