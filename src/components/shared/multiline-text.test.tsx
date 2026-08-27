import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MultilineText } from "./multiline-text";

test("renders an authored line break", () => {
  const markup = renderToStaticMarkup(
    <p>
      <MultilineText text={"First line\nSecond line"} />
    </p>
  );

  expect(markup).toBe("<p>First line<br/>Second line</p>");
});

test("renders a Windows-style line break", () => {
  const markup = renderToStaticMarkup(
    <p>
      <MultilineText text={"First line\r\nSecond line"} />
    </p>
  );

  expect(markup).toBe("<p>First line<br/>Second line</p>");
});

test("renders an authored blank line", () => {
  const markup = renderToStaticMarkup(
    <p>
      <MultilineText text={"First line\n\nSecond line"} />
    </p>
  );

  expect(markup).toBe("<p>First line<br/><br/>Second line</p>");
});
