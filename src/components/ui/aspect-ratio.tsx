type AspectRatioProps = React.ComponentProps<"div"> & {
  ratio?: number;
};

function AspectRatio({ ratio = 1, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ ...style, width: "100%", aspectRatio: ratio }}
      {...props}
    />
  );
}

export { AspectRatio };
