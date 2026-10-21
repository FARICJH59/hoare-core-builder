import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

test("builder identifies itself as HOARE-CodePen", () => {
  assert.match(html, /<title>HOARE-CodePen Autonomous Builder Platform<\/title>/);
  assert.match(html, /HOARE × CodePen Engine/);
});

test("preview is explicitly not an admitted or deployed execution", () => {
  assert.match(html, /Local preview only · HOARE admission pending/);
  assert.match(html, /No deployment triggered/);
  assert.match(html, /does not call a build, cloud, or HOARE-CORE execution endpoint/);
  assert.doesNotMatch(html, /Aegis Verified|Live Execution Enabled|● Compiled/);
});

test("editable source can refresh and reset the sandboxed preview", () => {
  assert.match(html, /id="source"/);
  assert.match(html, /id="refresh"/);
  assert.match(html, /id="reset"/);
  assert.match(html, /id="preview"/);
  assert.match(html, /sandbox="allow-scripts"/);
  assert.doesNotMatch(html, /sandbox="[^"]*allow-same-origin/);
  assert.match(html, /preview\.srcdoc\s*=\s*editor\.value/);
});

test("preview lifecycle distinguishes planning, build, admission, and execution", () => {
  for (const phrase of ["Describe and plan", "Build and test", "HOARE admission", "Execute and record"]) {
    assert.ok(html.includes(phrase), `missing lifecycle step: ${phrase}`);
  }
});
