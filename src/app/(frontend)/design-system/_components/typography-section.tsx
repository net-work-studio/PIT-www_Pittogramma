const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

const SIZE_SCALE = [
  { name: "text-xs", class: "text-xs" },
  { name: "text-sm", class: "text-sm" },
  { name: "text-base", class: "text-base" },
  { name: "text-lg", class: "text-lg" },
  { name: "text-xl", class: "text-xl" },
  { name: "text-2xl", class: "text-2xl" },
  { name: "text-3xl", class: "text-3xl" },
  { name: "text-4xl", class: "text-4xl" },
  { name: "text-5xl", class: "text-5xl" },
  { name: "text-6xl", class: "text-6xl" },
];

export default function TypographySection() {
  return (
    <section className="space-y-12" id="typography">
      <h2 className="font-mono text-xl uppercase">Typography</h2>

      <div className="space-y-8">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          Font Specimens
        </h3>

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs">
              Sono Mono (--font-sono) &mdash; Regular
            </p>
            <p className="font-mono text-lg">{SAMPLE_TEXT}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs">
              Sono Mono (--font-sono) &mdash; Italic
            </p>
            <p className="font-mono text-lg italic">{SAMPLE_TEXT}</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs">
              Aktual (--font-aktual / body) &mdash; Regular
            </p>
            <p className="font-sans text-lg">{SAMPLE_TEXT}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs">
              Aktual (--font-aktual / body) &mdash; Italic
            </p>
            <p className="font-sans text-lg italic">{SAMPLE_TEXT}</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs">
              System Serif
            </p>
            <p className="font-serif text-lg">{SAMPLE_TEXT}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          Size Scale (Aktual)
        </h3>
        <div className="space-y-3">
          {SIZE_SCALE.map((size) => (
            <div className="flex items-baseline gap-4" key={size.name}>
              <span className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground">
                {size.name}
              </span>
              <p className={size.class}>{SAMPLE_TEXT}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
