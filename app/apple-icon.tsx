import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #34d399 0%, #047857 100%)",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 42,
            right: 28,
            width: 32,
            height: 32,
            border: "8px solid white",
            borderBottom: "none",
            borderLeft: "none",
            borderRadius: "0 28px 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 38,
            width: 104,
            height: 74,
            background: "white",
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 62,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 44,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 58,
            width: 62,
            height: 32,
            borderRadius: "0 0 31px 31px",
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 58,
            width: 50,
            height: 14,
            borderRadius: "50%",
            background: "#f59e0b",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 96,
            width: 70,
            height: 10,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
