import React, { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";

const COLORS = [
  "#2196f3", "#f44336", "#4caf50", "#ff9800", "#9c27b0",
  "#00bcd4", "#e91e63", "#8bc34a", "#ff5722", "#607d8b",
  "#795548", "#9e9e9e",
];

const CX = 100;
const CY = 100;
const OUTER_R = 90;
const INNER_R = 52;

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlicePath(cx, cy, outerR, innerR, startDeg, endDeg) {
  const o1 = polarToXY(cx, cy, outerR, startDeg);
  const o2 = polarToXY(cx, cy, outerR, endDeg);
  const i1 = polarToXY(cx, cy, innerR, endDeg);
  const i2 = polarToXY(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

function buildSlices(sectors) {
  let start = 0;
  return sectors.map((s, i) => {
    const sweep = (s.pct / 100) * 360;
    const end = start + sweep;
    const slice = {
      ...s,
      color: COLORS[i % COLORS.length],
      path: donutSlicePath(CX, CY, OUTER_R, INNER_R, start, end - 0.5),
      midAngle: start + sweep / 2,
    };
    start = end;
    return slice;
  });
}

function DonutChart({ sectors, totalLabel }) {
  const [hovered, setHovered] = useState(null);
  const slices = buildSlices(sectors);

  const fmt = (v) =>
    v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "—";

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, flexWrap: "wrap" }}>
      <Box sx={{ flexShrink: 0 }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          {slices.map((s) => (
            <Tooltip
              key={s.name}
              title={`${s.name}: ${s.pct.toFixed(1)}% (${fmt(s.value)})`}
              placement="top"
            >
              <path
                d={s.path}
                fill={s.color}
                opacity={hovered === null || hovered === s.name ? 1 : 0.4}
                onMouseEnter={() => setHovered(s.name)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              />
            </Tooltip>
          ))}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            opacity={0.6}
          >
            {totalLabel}
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize={11} fill="currentColor">
            {sectors.length} setor{sectors.length !== 1 ? "es" : ""}
          </text>
        </svg>
      </Box>

      {/* Legenda */}
      <Box sx={{ flex: 1, minWidth: 160 }}>
        {slices.map((s) => (
          <Box
            key={s.name}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.75,
              opacity: hovered === null || hovered === s.name ? 1 : 0.4,
              cursor: "default",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <Box
              sx={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, bgcolor: s.color }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" noWrap fontWeight={600}>
                {s.name}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ color: s.pct > 40 ? "error.main" : "text.secondary", fontWeight: s.pct > 40 ? 700 : 400 }}
            >
              {s.pct.toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function buildSectors(positions) {
  const map = {};
  positions.forEach((p) => {
    const sector = p.sectorname || "Outros";
    map[sector] = (map[sector] || 0) + (p.current_value || 0);
  });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, pct: total > 0 ? (value / total) * 100 : 0 }));
}

export default DonutChart;
