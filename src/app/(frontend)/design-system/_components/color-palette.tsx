interface ColorPaletteProps {
  name: string;
  shades: string[];
}

export default function ColorPalette({ name, shades }: ColorPaletteProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-mono text-sm capitalize">{name}</h4>
      <div className="grid grid-cols-11 gap-1.5">
        {shades.map((shade) => (
          <div className="flex flex-col items-center gap-1" key={shade}>
            <div
              className="aspect-square w-full rounded-md border border-border"
              style={{
                backgroundColor: `var(--color-${name}-${shade})`,
              }}
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {shade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
