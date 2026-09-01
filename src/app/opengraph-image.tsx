import { ImageResponse } from "next/og";

export const alt = "Pittogramma — emerging graphic design";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#ffffff",
        color: "#111111",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ fontSize: 38, letterSpacing: "-1.5px" }}>Pittogramma</div>
      <div
        style={{
          fontSize: 76,
          letterSpacing: "-4px",
          lineHeight: 1,
          maxWidth: "920px",
        }}
      >
        Emerging graphic design, editorial content and resources.
      </div>
      <div style={{ borderTop: "4px solid #111111", width: "100%" }} />
    </div>,
    size
  );
}
