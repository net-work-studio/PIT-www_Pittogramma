import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

async function findTsxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? findTsxFiles(entryPath)
        : Promise.resolve(entryPath.endsWith(".tsx") ? [entryPath] : []);
    })
  );

  return files.flat();
}

async function readSourceFiles() {
  const files: Array<{ path: string; sourceFile: ts.SourceFile }> = [];

  for (const sourcePath of await findTsxFiles("src")) {
    const source = await readFile(sourcePath, "utf8");
    files.push({
      path: sourcePath,
      sourceFile: ts.createSourceFile(
        sourcePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      ),
    });
  }

  return files;
}

function getTagName(
  element: ts.JsxOpeningLikeElement,
  sourceFile: ts.SourceFile
) {
  return element.tagName.getText(sourceFile);
}

function getAttribute(
  element: ts.JsxOpeningLikeElement,
  name: string,
  sourceFile: ts.SourceFile
) {
  return element.attributes.properties.find(
    (attribute: ts.JsxAttributeLike): attribute is ts.JsxAttribute =>
      ts.isJsxAttribute(attribute) &&
      attribute.name.getText(sourceFile) === name
  );
}

function getRenderExpression(attribute: ts.JsxAttribute | undefined) {
  return attribute?.initializer && ts.isJsxExpression(attribute.initializer)
    ? attribute.initializer.expression
    : undefined;
}

function collectRenderedRootTags(
  node: ts.Node | undefined,
  sourceFile: ts.SourceFile,
  tags: string[] = []
) {
  if (!node) {
    return tags;
  }

  if (ts.isJsxElement(node)) {
    tags.push(getTagName(node.openingElement, sourceFile));
    return tags;
  }

  if (ts.isJsxSelfClosingElement(node)) {
    tags.push(getTagName(node, sourceFile));
    return tags;
  }

  ts.forEachChild(node, (child: ts.Node) => {
    collectRenderedRootTags(child, sourceFile, tags);
  });

  return tags;
}

function isExplicitlyFalse(attribute: ts.JsxAttribute | undefined) {
  const expression = getRenderExpression(attribute);
  return expression?.kind === ts.SyntaxKind.FalseKeyword;
}

function location(path: string, node: ts.Node, sourceFile: ts.SourceFile) {
  const position = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile)
  );
  return `${path}:${position.line + 1}`;
}

function getOpeningElement(node: ts.Node) {
  if (ts.isJsxElement(node)) {
    return node.openingElement;
  }

  if (ts.isJsxSelfClosingElement(node)) {
    return node;
  }
}

describe("Base UI consumer contracts", () => {
  test("non-native Button render elements declare nativeButton={false}", async () => {
    const violations: string[] = [];

    for (const { path, sourceFile } of await readSourceFiles()) {
      function visit(node: ts.Node) {
        const openingElement = getOpeningElement(node);

        if (
          openingElement &&
          getTagName(openingElement, sourceFile) === "Button"
        ) {
          const render = getAttribute(openingElement, "render", sourceFile);
          const renderedTags = collectRenderedRootTags(
            getRenderExpression(render),
            sourceFile
          );
          const nativeButton = getAttribute(
            openingElement,
            "nativeButton",
            sourceFile
          );

          if (
            renderedTags.some((tag) => tag !== "button") &&
            !isExplicitlyFalse(nativeButton)
          ) {
            violations.push(
              `${location(path, openingElement, sourceFile)} renders ${renderedTags
                .map((tag) => `<${tag}>`)
                .join(" or ")} without nativeButton={false}`
            );
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    }

    expect(violations.join("\n")).toBe("");
  });

  test("paragraph-backed DialogDescription content stays phrasing-only", async () => {
    const violations: string[] = [];
    const blockTags = new Set(["div", "p"]);

    for (const { path, sourceFile } of await readSourceFiles()) {
      function visit(node: ts.Node) {
        if (
          ts.isJsxElement(node) &&
          getTagName(node.openingElement, sourceFile) === "DialogDescription"
        ) {
          const render = getAttribute(
            node.openingElement,
            "render",
            sourceFile
          );
          const renderedTags = collectRenderedRootTags(
            getRenderExpression(render),
            sourceFile
          );
          const rendersParagraph =
            render === undefined || renderedTags.includes("p");

          if (rendersParagraph) {
            function inspect(child: ts.Node) {
              const openingElement = getOpeningElement(child);

              if (
                openingElement &&
                blockTags.has(getTagName(openingElement, sourceFile))
              ) {
                violations.push(
                  `${location(path, child, sourceFile)} nests <${getTagName(
                    openingElement,
                    sourceFile
                  )}> inside paragraph-backed DialogDescription`
                );
              }

              ts.forEachChild(child, inspect);
            }

            node.children.forEach(inspect);
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    }

    expect(violations.join("\n")).toBe("");
  });
});
