"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { AxisScores } from "@/types";
import { AXES } from "@/constants/axes";
import { getAxisLabel } from "@/lib/i18n";
import type { Locale } from "@/types";

interface Props {
  averages: AxisScores;
  locale: Locale;
}

export default function DNARadarChart({ averages, locale }: Props) {
  const data = AXES.map((axis) => ({
    axis: getAxisLabel(locale, axis.key),
    value: averages[axis.key],
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={400} data-testid="radar-chart">
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="78%">
        <PolarGrid stroke="#dbcab0" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "#4f5961", fontSize: 12, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tickCount={6}
          tick={{ fill: "#9a8b78", fontSize: 10 }}
        />
        <Radar
          name="DNA"
          dataKey="value"
          stroke="#0d6d63"
          fill="#0d6d63"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
