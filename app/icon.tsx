import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 112,
          position: "relative",
        }}
      >
        {/* Cart handle */}
        <div
          style={{
            position: "absolute",
            top: 118,
            right: 78,
            width: 90,
            height: 90,
            border: "22px solid white",
            borderBottom: "none",
            borderLeft: "none",
            borderRadius: "0 80px 0 0",
          }}
        />
        {/* Cart body */}
        <div
          style={{
            position: "absolute",
            bottom: 88,
            left: 108,
            width: 296,
            height: 210,
            background: "white",
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
          }}
        />
        {/* Wheels */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 176,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#059669",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 70,
            right: 126,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#059669",
            }}
          />
        </div>
        {/* Bowl */}
        <div
          style={{
            position: "absolute",
            top: 168,
            width: 176,
            height: 88,
            borderRadius: "0 0 88px 88px",
            background: "white",
          }}
        />
        {/* Porridge */}
        <div
          style={{
            position: "absolute",
            top: 168,
            width: 144,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)",
          }}
        />
        {/* Plate */}
        <div
          style={{
            position: "absolute",
            top: 268,
            width: 200,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
