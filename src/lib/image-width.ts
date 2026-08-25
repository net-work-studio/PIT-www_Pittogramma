/** Prevent remote image transforms from upscaling beyond the source asset. */
export function getSafeImageWidth(
  requestedWidth: number,
  sourceWidth: number | undefined
): number {
  return sourceWidth ? Math.min(requestedWidth, sourceWidth) : requestedWidth;
}

/** Next's optimizer must not be asked to upscale an already width-capped source. */
export function shouldBypassImageOptimization(
  requestedWidth: number,
  sourceWidth: number | undefined
): boolean {
  return sourceWidth !== undefined && sourceWidth < requestedWidth;
}
