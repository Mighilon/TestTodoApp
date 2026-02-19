import React from "react";

// ─── Inline Styles ────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  // The outer rectangle — replaces .slider-container shape logic
  rectangleTest: {
    position: "relative",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    // No background here — it's fully transparent so the glass layers
    // can blur/warp whatever sits behind the component
    background: "rgba(255,255,255,0.4)",
  },

  // ── Layer 1: Liquid-lens distortion + backdrop blur ──────────────────────────
  // Mirrors .slider-thumb-glass-filter
  // filter: url(#mini-liquid-lens) warps the content behind the rectangle
  // backdrop-filter: blur adds a frosted-glass softness
  glassFilter: {
    position: "absolute",
    inset: 0,
    zIndex: -5,
    backdropFilter: "blur(0.6px)",
    WebkitBackdropFilter: "blur(0.6px)",
    // References the SVG filter defined in <GlassFilterDef>
    filter: "url(#rect-liquid-lens)",
  },

  // ── Layer 2: Translucent white film ─────────────────────────────────────────
  // Mirrors .slider-thumb-glass-overlay
  // Softens the raw distortion and adds a faint milky depth
  glassOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: -4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  // ── Layer 3: Specular edge glints & inner glow ───────────────────────────────
  // Mirrors .slider-thumb-glass-specular
  // Pure inset box-shadows paint the lighting without any image
  glassSpecular: {
    position: "absolute",
    inset: 0,
    zIndex: -3,
    borderRadius: "inherit",
    boxShadow: [
      "inset 1px 1px 0 rgba(69, 168, 243, 0.22)", // top-left blue rim highlight
      "inset 1px 3px 0 rgba(28, 63, 90, 0.05)", // subtle inner top shadow
      "inset 0 0 32px rgba(255, 255, 255, 0.55)", // central white glow
      "inset -1px -1px 0 rgba(69, 168, 243, 0.14)", // bottom-right blue rim highlight
    ].join(", "),
  },

  // Optional: content slot that sits on top of all glass layers
  glassContent: {
    position: "absolute",
    inset: 0,
    zIndex: -2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
};

// ─── SVG Filter Definition ────────────────────────────────────────────────────
//
// Invisible SVG (0×0) that registers the #rect-liquid-lens filter globally.
// Works identically to the original slider's SVG block:
//
//   1. feImage  — generates a radial gradient used as a displacement map.
//                 Center pixel = rgb(128,128,255) → R & G at neutral midpoint = no shift.
//                 Edge pixels  = rgb(255,255,255) → R & G at max = maximum outward push.
//
//   2. feDisplacementMap — reads R channel for X shift, G channel for Y shift.
//                          scale="-252" inverts direction → pixels are pulled *inward*
//                          toward the centre, simulating a converging glass lens.
//
//   3. feMerge — outputs the displaced result as the filter's final image.
//
// x="-50%" y="-50%" width="200%" height="200%" on <filter> keeps the distortion
// region oversized so pixels near the edges aren't clipped mid-warp.

const GlassFilterDef: React.FC = () => (
  <svg
    width={0}
    height={0}
    style={{ position: "absolute", overflow: "hidden" }}
    aria-hidden="true"
  >
    <defs>
      <filter
        id="rect-liquid-lens"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        {/*
          feImage embeds a tiny inline SVG as a data-URI.
          The radial gradient encodes the lens shape as colour:
            - centre  → rgb(128, 128, 255): R=128, G=128 → neutral → no displacement
            - edge    → rgb(255, 255, 255): R=255, G=255 → max displacement
        */}
        <feImage
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="normalMap"
          xlinkHref={`data:image/svg+xml;utf8,
            <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
              <radialGradient id='invmap' cx='50%' cy='50%' r='75%'>
                <stop offset='0%'  stop-color='rgb(128,128,255)'/>
                <stop offset='90%' stop-color='rgb(255,255,255)'/>
              </radialGradient>
              <rect width='100%' height='100%' fill='url(%23invmap)'/>
            </svg>`}
          preserveAspectRatio="xMidYMid slice"
        />

        {/*
          feDisplacementMap moves each pixel of SourceGraphic
          by an amount determined by the colour in normalMap:
            - xChannelSelector="R" → red  channel drives horizontal shift
            - yChannelSelector="G" → green channel drives vertical shift
            - scale="-252"         → large negative value pulls pixels inward
                                     (positive would push outward like a magnifier)
        */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="normalMap"
          scale="-30"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />

        {/* feMerge outputs the displaced result as the final filter image */}
        <feMerge>
          <feMergeNode in="displaced" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

interface RectangleTestProps {
  children?: React.ReactNode;
  rounded?: string;
  className?: string;
}

const Glass: React.FC<RectangleTestProps> = ({
  children,
  rounded,
  className,
}) => {
  return (
    <>
      {/*
        The SVG filter must exist in the DOM before the element that uses it.
        Rendering it as a sibling (outside the rectangle) keeps it globally
        accessible and avoids z-index or overflow-hidden clipping issues.
      */}
      <GlassFilterDef />

      <div
        style={{
          ...styles.rectangleTest,
        }}
        className={rounded}
      >
        {/* Layer 0 — liquid-lens warp + backdrop blur */}
        <div style={styles.glassFilter} />

        {/* Layer 1 — white semi-transparent film */}
        <div style={styles.glassOverlay} />

        {/* Layer 2 — specular edge glints & inner glow */}
        <div style={styles.glassSpecular} />

        {children && <div className={className}>{children}</div>}
      </div>
    </>
  );
};

export default Glass;

// ─── Usage Example ────────────────────────────────────────────────────────────
//
// Place something colourful/textured *behind* RectangleTest so the lens
// distortion is visible. The component itself is fully transparent.
//
// function Demo() {
//   return (
//     <div style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       height: "100vh",
//       // Gradient behind the glass so the warp effect is visible
//       background: "linear-gradient(135deg, #49a3fc 0%, #3681ee 50%, #f8f8f8 100%)",
//     }}>
//       <RectangleTest width={320} height={140} borderRadius={28}>
//         <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
//           Glass Panel
//         </span>
//       </RectangleTest>
//     </div>
//   );
// }
