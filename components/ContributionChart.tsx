"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useDNA } from "@/lib/DNAContext";
import { getAxisLabel } from "@/lib/i18n";
import { computeBoxplotStats } from "@/lib/engine";
import { AXES } from "@/constants/axes";
import type { ArtworkContribution, RepresentativeArtworks } from "@/types";

interface Props {
  contributions: ArtworkContribution[];
  representative: RepresentativeArtworks;
}

interface PointModel {
  x: number;
  y: number;
  radius: number;
  item: ArtworkContribution;
  order: number;
  score: number;
  inBox: boolean;
  belowBox: boolean;
  aboveBox: boolean;
  outlier: boolean;
}

function getNiceTickStep(range: number, targetTicks = 6): number {
  const safeRange = Math.max(1e-6, range);
  const roughStep = safeRange / Math.max(2, targetTicks);
  const exponent = Math.floor(Math.log10(roughStep));
  const base = Math.pow(10, exponent);
  const normalized = roughStep / base;
  if (normalized <= 1) return base;
  if (normalized <= 2) return 2 * base;
  if (normalized <= 5) return 5 * base;
  return 10 * base;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function getStrongestAxes(
  scores: Record<string, number>,
  count: number,
  locale: string,
  getLabel: (l: string, k: string) => string
): string {
  return AXES.map((a) => ({ key: a.key, val: scores[a.key] ?? 0 }))
    .sort((a, b) => b.val - a.val)
    .slice(0, count)
    .map((a) => getLabel(locale, a.key))
    .join(", ");
}

export default function ContributionChart({ contributions, representative }: Props) {
  const { t, locale } = useDNA();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    point: PointModel | null;
  }>({ visible: false, x: 0, y: 0, point: null });

  const pointsRef = useRef<PointModel[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const items = [...contributions].sort((a, b) => {
      const aS = Number(a.profileContributionScore) || 0;
      const bS = Number(b.profileContributionScore) || 0;
      if (aS !== bS) return aS - bS;
      return a.entryId.localeCompare(b.entryId);
    });

    const values = items.map((item) => Number(item.profileContributionScore) || 0);
    const stats = computeBoxplotStats(values);
    const ratio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width || 520);
    const chartHeight = Math.max(280, Math.round(width * 0.54));
    const margin = { top: 20, right: 20, bottom: 56, left: 68 };
    const chartArea = {
      x: margin.left,
      y: margin.top,
      width: Math.max(120, width - margin.left - margin.right),
      height: Math.max(120, chartHeight - margin.top - margin.bottom),
    };

    canvas.width = width * ratio;
    canvas.height = chartHeight * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${chartHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, chartHeight);

    if (items.length === 0) {
      ctx.fillStyle = "#5d5048";
      ctx.font = '14px "IBM Plex Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.representativeNoData, width / 2, chartHeight / 2);
      pointsRef.current = [];
      return;
    }

    let scaleMin = stats.min;
    let scaleMax = stats.max;
    if (scaleMin === scaleMax) {
      scaleMin -= 1;
      scaleMax += 1;
    }
    const padding = Math.max(0.6, (scaleMax - scaleMin) * 0.18);
    scaleMin -= padding;
    scaleMax += padding;

    const mapY = (value: number) => {
      const normalized = (value - scaleMin) / Math.max(1e-6, scaleMax - scaleMin);
      return chartArea.y + chartArea.height - Math.max(0, Math.min(1, normalized)) * chartArea.height;
    };

    const slotWidth = chartArea.width / Math.max(1, items.length);
    const mapX = (index: number) => chartArea.x + slotWidth * (index + 0.5);
    const baselineY = mapY(stats.median);
    const yQ1 = mapY(stats.q1);
    const yQ3 = mapY(stats.q3);
    const yTop = chartArea.y;
    const yBottom = chartArea.y + chartArea.height;

    // Grid lines
    ctx.strokeStyle = "#d9c8ae";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#5f5247";
    ctx.font = '11px "IBM Plex Sans", sans-serif';

    const yRange = scaleMax - scaleMin;
    const step = getNiceTickStep(yRange, 6);
    const startTick = Math.ceil(scaleMin / step) * step;
    for (let value = startTick; value <= scaleMax + step * 0.5; value += step) {
      const y = mapY(value);
      ctx.beginPath();
      ctx.moveTo(chartArea.x, y);
      ctx.lineTo(chartArea.x + chartArea.width, y);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${round2(value)}`, chartArea.x - 8, y);
    }

    // Quartile shaded bands
    ctx.fillStyle = "#f7d9c844";
    ctx.fillRect(chartArea.x, yQ1, chartArea.width, yBottom - yQ1);
    ctx.fillStyle = "#0f6f6420";
    ctx.fillRect(chartArea.x, yQ3, chartArea.width, yQ1 - yQ3);
    ctx.fillStyle = "#d8efcf44";
    ctx.fillRect(chartArea.x, yTop, chartArea.width, yQ3 - yTop);

    // Q1 / Median / Q3 dashed lines
    const quartileLines = [
      { y: yQ1, label: "Q1", color: "#886d4d" },
      { y: mapY(stats.median), label: locale === "fr" ? "Médiane" : locale === "en" ? "Median" : "Mediaan", color: "#234a45" },
      { y: yQ3, label: "Q3", color: "#5a7a56" },
    ];
    quartileLines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(chartArea.x, line.y);
      ctx.lineTo(chartArea.x + chartArea.width, line.y);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Axes frame
    ctx.strokeStyle = "#8e7b61";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(chartArea.x, yBottom);
    ctx.lineTo(chartArea.x + chartArea.width, yBottom);
    ctx.moveTo(chartArea.x, yTop);
    ctx.lineTo(chartArea.x, yBottom);
    ctx.stroke();

    // Y-axis label
    ctx.fillStyle = "#5b4d43";
    ctx.font = '12px "IBM Plex Sans", sans-serif';
    ctx.save();
    ctx.translate(chartArea.x - 54, chartArea.y + chartArea.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(t.contributionAxisY, 0, 0);
    ctx.restore();

    // Median baseline
    ctx.strokeStyle = "#7f786f";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.x, baselineY);
    ctx.lineTo(chartArea.x + chartArea.width, baselineY);
    ctx.stroke();

    // Lollipop points
    const points: PointModel[] = items.map((item, index) => {
      const score = Number(item.profileContributionScore) || 0;
      const x = mapX(index);
      const y = mapY(score);
      const inBox = score >= stats.q1 && score <= stats.q3;
      const belowBox = score < stats.q1;
      const aboveBox = score > stats.q3;
      const outlier = score < stats.lowerFence || score > stats.upperFence;
      const radius = outlier ? 7.2 : 5.8;
      const fill = belowBox ? "#b05a37" : aboveBox ? "#2f7748" : "#0d6d63";

      // Stem
      ctx.beginPath();
      ctx.moveTo(x, baselineY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#7d756c";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = "#fff7ed";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      if (outlier) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = "#3f342d";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, yBottom);
      ctx.lineTo(x, yBottom + 5);
      ctx.strokeStyle = "#8e7b61";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Index label
      ctx.fillStyle = "#5f5247";
      ctx.font = '10px "IBM Plex Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(String(index + 1), x, yBottom + 8);

      return { x, y, radius, item, order: index + 1, score, inBox, belowBox, aboveBox, outlier };
    });

    pointsRef.current = points;

    // X-axis label
    ctx.fillStyle = "#5b4d43";
    ctx.font = '12px "IBM Plex Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(t.contributionAxisX, chartArea.x + chartArea.width / 2, yBottom + 30);
  }, [contributions, t, locale]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let nearest: PointModel | null = null;
    let nearestDist = Infinity;
    for (const p of pointsRef.current) {
      const dx = mx - p.x;
      const dy = my - p.y;
      const d2 = dx * dx + dy * dy;
      const hitRadius = Math.max(10, p.radius + 5);
      if (d2 <= hitRadius * hitRadius && d2 < nearestDist) {
        nearest = p;
        nearestDist = d2;
      }
    }

    if (nearest) {
      canvas.style.cursor = "pointer";
      setTooltip({ visible: true, x: e.clientX + 14, y: e.clientY + 14, point: nearest });
    } else {
      canvas.style.cursor = "default";
      setTooltip((prev) => (prev.visible ? { visible: false, x: 0, y: 0, point: null } : prev));
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, point: null });
    if (canvasRef.current) canvasRef.current.style.cursor = "default";
  }, []);

  const values = contributions.map((c) => c.profileContributionScore);
  const stats = computeBoxplotStats(values);
  const sorted = [...contributions].sort(
    (a, b) => (a.profileContributionScore || 0) - (b.profileContributionScore || 0)
  );
  const insideCount = sorted.filter((c) => c.profileContributionScore >= stats.q1 && c.profileContributionScore <= stats.q3).length;
  const belowCount = sorted.filter((c) => c.profileContributionScore < stats.q1).length;
  const aboveCount = sorted.filter((c) => c.profileContributionScore > stats.q3).length;

  const tp = tooltip.point;
  const statusLabel = tp
    ? tp.inBox
      ? t.contributionInBox
      : tp.belowBox
        ? t.contributionBelowBox
        : t.contributionAboveBox
    : "";

  return (
    <div ref={containerRef} className="relative">
      {/* Representative summary */}
      {(representative.most || representative.least) && (
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          {representative.most && (
            <div className="rounded-lg border border-[#c4ddc8] bg-[#eef8ef] px-3 py-2">
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#2f7748]">
                {t.representativeMost}
              </span>
              <p className="mt-0.5 text-[0.82rem] font-bold text-ink">{representative.most.artworkTitle}</p>
              <p className="text-[0.72rem] text-ink-soft">
                {representative.most.artistName || t.noArtist} · score {round2(representative.most.profileContributionScore)}
              </p>
            </div>
          )}
          {representative.least && (
            <div className="rounded-lg border border-[#ddc8b4] bg-[#fdf4ec] px-3 py-2">
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#b05a37]">
                {t.representativeLeast}
              </span>
              <p className="mt-0.5 text-[0.82rem] font-bold text-ink">{representative.least.artworkTitle}</p>
              <p className="text-[0.72rem] text-ink-soft">
                {representative.least.artistName || t.noArtist} · score {round2(representative.least.profileContributionScore)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={t.contributionChartTitle}
      />

      {/* Tooltip */}
      {tooltip.visible && tp && (
        <div
          className="pointer-events-none fixed z-[999] max-w-[260px] rounded-xl border border-[#d9c8ae] bg-[#fffdf8] p-2.5 shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tp.item.imageUrl && (
            <img
              src={tp.item.imageUrl}
              alt={tp.item.artworkTitle}
              className="mb-1.5 h-12 w-12 rounded-lg border border-[#dfccb0] bg-[#f7ecdc] object-cover"
            />
          )}
          <p className="text-[0.78rem] font-bold text-ink">{tp.item.artworkTitle}</p>
          <p className="text-[0.72rem] text-ink-soft">{tp.item.artistName || t.noArtist}</p>
          <p className="mt-1 text-[0.7rem] text-[#5d5045]">
            {tp.item.chamber} · object {tp.item.slot}
          </p>
          <p className="text-[0.7rem] text-[#5d5045]">
            {t.contributionRank}: {tp.order} / {pointsRef.current.length}
          </p>
          <p className="text-[0.7rem] text-[#5d5045]">
            {t.contributionAxisY}: {round2(tp.score)}
          </p>
          <p className="text-[0.7rem] text-[#5d5045]">
            {t.contributionImpactShare}: {round1(tp.item.impactShare)}% · {t.contributionDistance}: {round2(tp.item.distanceToProfile)}
          </p>
          <p className="text-[0.7rem] text-[#5d5045]">
            {t.contributionTopAxes}: {getStrongestAxes(tp.item.scores, 2, locale, getAxisLabel as unknown as (l: string, k: string) => string)}
          </p>
          <p className="text-[0.7rem] text-[#5d5045]">
            {statusLabel}{tp.outlier ? ` · ${t.contributionOutlier}` : ""}
          </p>
        </div>
      )}

      {/* Legend + summary */}
      <p className="mt-2 text-[0.74rem] text-ink-soft">{t.contributionChartLegend}</p>
      {contributions.length > 0 && (
        <p className="mt-1 text-[0.72rem] text-ink-soft">
          Min {round2(stats.min)} · Q1 {round2(stats.q1)} · Med {round2(stats.median)} · Q3 {round2(stats.q3)} · Max {round2(stats.max)} · IQR {round2(stats.iqr)}
          {" · "}
          {insideCount} in IQR, {belowCount} &lt; Q1, {aboveCount} &gt; Q3
        </p>
      )}
    </div>
  );
}
