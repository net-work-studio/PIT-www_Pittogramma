import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AspectRatio } from "./aspect-ratio";

test("preserves full-width sizing for flex-column card layouts", () => {
  const markup = renderToStaticMarkup(
    <AspectRatio ratio={4 / 3}>
      <div className="h-full w-full" />
    </AspectRatio>
  );

  expect(markup.includes("width:100%")).toBe(true);
  expect(markup.includes("aspect-ratio:1.3333333333333333")).toBe(true);
});
