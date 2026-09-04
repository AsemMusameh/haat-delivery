import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const roots = ["app", "components"];
const files = roots.flatMap((root) => walk(root)).filter((file) => file.endsWith(".tsx"));
const issues = [];
let buttons = 0;
let links = 0;

for (const file of files) {
  const sourceText = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  visit(source, []);

  function visit(node, ancestors) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = opening.tagName.getText(source);
      const attrs = new Map(opening.attributes.properties
        .filter(ts.isJsxAttribute)
        .map((attribute) => [attribute.name.getText(source), attribute]));
      const line = source.getLineAndCharacterOfPosition(opening.getStart(source)).line + 1;

      if (tag === "button") {
        buttons += 1;
        const inForm = ancestors.some((ancestor) => {
          if (!ts.isJsxElement(ancestor)) return false;
          return ancestor.openingElement.tagName.getText(source) === "form";
        });
        const type = literalAttribute(attrs.get("type"));
        const hasAction = attrs.has("onClick") || attrs.has("formAction") || type === "submit" || (inForm && type !== "button");
        if (!hasAction) issues.push(`${file}:${line} button has no action`);
      }

      if (tag === "Link" || tag === "a") {
        links += 1;
        const href = attrs.get("href");
        const value = literalAttribute(href);
        if (!href || value === "" || value === "#" || value?.startsWith("javascript:")) {
          issues.push(`${file}:${line} ${tag} has an empty or placeholder href`);
        }
      }
    }
    ts.forEachChild(node, (child) => visit(child, [...ancestors, node]));
  }

  function literalAttribute(attribute) {
    if (!attribute?.initializer) return undefined;
    if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
    return undefined;
  }
}

console.log(JSON.stringify({ files: files.length, buttons, links, issues }, null, 2));
process.exitCode = issues.length ? 1 : 0;

function walk(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(root, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
