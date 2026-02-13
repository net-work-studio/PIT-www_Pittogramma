import ColorPalette from "./color-palette";

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

const PALETTES = ["blue", "yellow", "orange", "green"];

const SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
];

export default function ColorsSection() {
  return (
    <section className="space-y-12" id="colors">
      <h2 className="font-mono text-xl uppercase">Colors</h2>

      <div className="space-y-8">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          Named Palettes
        </h3>
        {PALETTES.map((palette) => (
          <ColorPalette key={palette} name={palette} shades={SHADES} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          Semantic Tokens
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SEMANTIC_TOKENS.map((token) => (
            <div className="flex flex-col gap-1.5" key={token}>
              <div
                className="h-12 w-full rounded-md border border-border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                --{token}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
