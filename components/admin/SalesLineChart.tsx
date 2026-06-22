"use client";

import { useMemo } from "react";
import type { Order } from "@/lib/types";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const W = 560;
const H = 200;
const PAD_X = 40;
const PAD_Y = 24;

interface SalesLineChartProps {
  orders: Order[];
}

export function SalesLineChart({ orders }: SalesLineChartProps) {
  const { points, maxY } = useMemo(() => {
    const totals = new Array(7).fill(0);
    const now = new Date();

    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const d = new Date(o.createdAt);
      const diff = Math.floor(
        (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff >= 0 && diff < 7) {
        totals[6 - diff] += o.total;
      }
    });

    const maxY = Math.max(...totals, 250);

    const pts = totals.map((v, i) => {
      const x = PAD_X + (i / 6) * (W - PAD_X * 2);
      const y = PAD_Y + (1 - v / maxY) * (H - PAD_Y * 2);
      return { x, y };
    });

    return { points: pts, maxY };
  }, [orders]);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - PAD_Y} L ${points[0].x} ${H - PAD_Y} Z`;

  const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];

  const formatY = (v: number) => {
    if (v >= 1000) return `${Math.round(v / 1000)}K`;
    return String(Math.round(v));
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]">
        {yTicks.map((tick, i) => {
          const y = PAD_Y + (1 - tick / maxY) * (H - PAD_Y * 2);
          return (
            <g key={i}>
              <line
                x1={PAD_X}
                y1={y}
                x2={W - PAD_X}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={PAD_X - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-[9px]"
              >
                {formatY(tick)}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#chartGradient)" opacity="0.3" />
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="white"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={H - 6}
              textAnchor="middle"
              className="fill-gray-400 text-[9px]"
            >
              {DAY_LABELS[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
