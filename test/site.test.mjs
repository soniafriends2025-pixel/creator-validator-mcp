import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

// Each case runs in a fresh process because SITE is read once at import.
function probe(env) {
  const code = `
    import { SITE, CV_PAGE } from "./dist/content.js";
    import { buildPrefillLink } from "./dist/prefill.js";
    const link = buildPrefillLink({ v: 1, pack: "validate5", package: "validate5", creators: [] });
    console.log(JSON.stringify({ SITE, CV_PAGE, link }));`;
  const e = { ...process.env, ...env };
  if (env.SONIAIA_SITE_URL === undefined) delete e.SONIAIA_SITE_URL;
  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", code], { env: e, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
}

test("default = production for page and prefill links", () => {
  const r = probe({});
  assert.equal(r.SITE, "https://www.soniaia.com");
  assert.equal(r.CV_PAGE, "https://www.soniaia.com/tools/creator-validator");
  assert.ok(r.link.startsWith("https://www.soniaia.com/tools/fake-check/success?package=validate5#cvprefill="));
});

test("override changes page and prefill links (trailing slash stripped)", () => {
  const r = probe({ SONIAIA_SITE_URL: "https://preview-abc.vercel.app/" });
  assert.equal(r.SITE, "https://preview-abc.vercel.app");
  assert.equal(r.CV_PAGE, "https://preview-abc.vercel.app/tools/creator-validator");
  assert.ok(r.link.startsWith("https://preview-abc.vercel.app/tools/fake-check/success?package=validate5#cvprefill="));
});

test("invalid override throws at startup", () => {
  for (const bad of ["http://x.vercel.app", "not a url", "https://x.app/path", "https://x.app/?a=1", "https://x.app/#h", ""]) {
    assert.throws(() => probe({ SONIAIA_SITE_URL: bad }), undefined, `should reject ${JSON.stringify(bad)}`);
  }
});
