import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Language } from '../types/voice';

export interface ScoreDataPoint {
  day: number;
  score: number;
  isCompleted: boolean;
  isCurrent: boolean;
  wpm?: number;
  clarity?: number;
}

interface D3VoiceScoreChartProps {
  data: ScoreDataPoint[];
  language: Language;
  currentDay: number;
  onSelectDay?: (day: number) => void;
}

export function D3VoiceScoreChart({
  data,
  language,
  currentDay,
  onSelectDay
}: D3VoiceScoreChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ScoreDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth || 480;
    const height = 220;
    const margin = { top: 25, right: 25, bottom: 35, left: 38 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    // Defs & Gradients
    const defs = svg.append('defs');

    // Area fill gradient (Emerald to transparent)
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-voice-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.45);
    areaGradient.append('stop').attr('offset', '75%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.1);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0f172a').attr('stop-opacity', 0.0);

    // Stroke gradient
    const strokeGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-voice-stroke-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    strokeGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4');
    strokeGradient.append('stop').attr('offset', '50%').attr('stop-color', '#10b981');
    strokeGradient.append('stop').attr('offset', '100%').attr('stop-color', '#34d399');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X and Y Scales
    const xScale = d3
      .scaleLinear()
      .domain([1, 30])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([50, 100])
      .nice()
      .range([innerHeight, 0]);

    // Grid Lines
    const yGrid = d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-opacity', 0.7);
    g.select('.grid .domain').remove();

    // Baseline Reference Line (Day 1 baseline: 65)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(65))
      .attr('y2', yScale(65))
      .attr('stroke', '#64748b')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-opacity', 0.5);

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yScale(65) - 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(language === 'bn' ? 'বেসলাইন (৬৫)' : 'Baseline (65)');

    // Target Reference Line (Day 30 target: 95)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(95))
      .attr('y2', yScale(95))
      .attr('stroke', '#10b981')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-opacity', 0.4);

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yScale(95) - 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#34d399')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(language === 'bn' ? 'লক্ষ্য (৯৫%)' : 'Target (95%)');

    // D3 Line Generator with smooth cubic interpolation
    const lineGenerator = d3
      .line<ScoreDataPoint>()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d.score))
      .curve(d3.curveMonotoneX);

    // D3 Area Generator
    const areaGenerator = d3
      .area<ScoreDataPoint>()
      .x((d) => xScale(d.day))
      .y0(innerHeight)
      .y1((d) => yScale(d.score))
      .curve(d3.curveMonotoneX);

    // Append Area Path
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3-voice-area-grad)')
      .attr('d', areaGenerator);

    // Append Line Path with smooth glow
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#d3-voice-stroke-grad)')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#glow)')
      .attr('d', lineGenerator);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([1, 5, 10, 15, 20, 25, 30])
      .tickFormat((d) => `D${d}`);

    const gx = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    gx.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('dy', '10px');
    gx.selectAll('line').attr('stroke', '#334155');
    gx.select('.domain').attr('stroke', '#334155');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    const gy = g.append('g').call(yAxis);

    gy.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');
    gy.selectAll('line').remove();
    gy.select('.domain').remove();

    // Data Points (Circles)
    const pointsGroup = g.append('g').attr('class', 'points');

    data.forEach((d) => {
      const cx = xScale(d.day);
      const cy = yScale(d.score);
      const isPastOrCurrent = d.day <= currentDay;

      // Outer ring for current day
      if (d.day === currentDay) {
        pointsGroup
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.6)
          .attr('class', 'animate-ping');
      }

      const point = pointsGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', d.day === currentDay ? 5 : isPastOrCurrent ? 3.5 : 2.5)
        .attr('fill', d.day === currentDay ? '#10b981' : isPastOrCurrent ? '#34d399' : '#475569')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseenter', (event) => {
          setHoveredPoint(d);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: cx + margin.left,
              y: cy + margin.top
            });
          }
        })
        .on('mouseleave', () => {
          setHoveredPoint(null);
          setTooltipPos(null);
        })
        .on('click', () => {
          if (onSelectDay) {
            onSelectDay(d.day);
          }
        });
    });

    // Milestone Flag Nodes (Day 7, Day 14, Day 21, Day 30)
    [7, 14, 21, 30].forEach((mDay) => {
      const mPoint = data.find((p) => p.day === mDay);
      if (mPoint) {
        const mx = xScale(mDay);
        const my = yScale(mPoint.score);

        g.append('circle')
          .attr('cx', mx)
          .attr('cy', my)
          .attr('r', 6)
          .attr('fill', mDay <= currentDay ? '#10b981' : '#334155')
          .attr('stroke', '#f8fafc')
          .attr('stroke-width', 1.5);
      }
    });

  }, [data, language, currentDay, onSelectDay]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      <svg ref={svgRef} className="w-full overflow-visible" />

      {/* Floating Hover Tooltip */}
      {hoveredPoint && tooltipPos && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-slate-950/95 border border-emerald-500/60 shadow-2xl backdrop-blur-md text-center animate-fade-in"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-emerald-400">
            <span>{language === 'bn' ? `দিন #${hoveredPoint.day}` : `Day #${hoveredPoint.day}`}</span>
            {hoveredPoint.day === currentDay && (
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-md">
                {language === 'bn' ? 'বর্তমান' : 'Today'}
              </span>
            )}
          </div>
          <div className="text-sm font-black font-mono text-white mt-0.5">
            {hoveredPoint.score}%{' '}
            <span className="text-[10px] font-sans font-normal text-slate-400">
              {language === 'bn' ? 'স্কোর' : 'Score'}
            </span>
          </div>
          <div className="text-[9px] text-cyan-300 font-mono mt-0.5">
            +{Math.max(0, hoveredPoint.score - 65)}% {language === 'bn' ? 'বেসলাইন গ্রোথ' : 'from baseline'}
          </div>
        </div>
      )}
    </div>
  );
}
