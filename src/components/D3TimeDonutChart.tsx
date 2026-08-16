import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Language, TaskTimeBreakdown } from '../types/voice';

interface DonutSliceData {
  id: string;
  nameBn: string;
  nameEn: string;
  seconds: number;
  color: string;
  iconName: string;
}

interface D3TimeDonutChartProps {
  timeBreakdown: TaskTimeBreakdown;
  language: Language;
  goalMinutes?: number;
}

export function D3TimeDonutChart({
  timeBreakdown,
  language,
  goalMinutes = 30
}: D3TimeDonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<DonutSliceData | null>(null);

  const rawData: DonutSliceData[] = [
    {
      id: 'breath',
      nameBn: 'ডায়াফ্রাম্যাটিক শ্বাস (Breath)',
      nameEn: 'Breathwork & Oxygen',
      seconds: Math.max(0, timeBreakdown.breathSeconds),
      color: '#06b6d4', // Cyan
      iconName: 'wind'
    },
    {
      id: 'voice',
      nameBn: 'ভোকাল ও রেজোন্যান্স (Voice)',
      nameEn: 'Voice, Humming & Resonance',
      seconds: Math.max(0, timeBreakdown.voiceSeconds),
      color: '#10b981', // Emerald
      iconName: 'mic'
    },
    {
      id: 'body',
      nameBn: 'দেহভঙ্গি ও রিল্যাক্সেশন (Body)',
      nameEn: 'Body Posture & Release',
      seconds: Math.max(0, timeBreakdown.bodySeconds),
      color: '#f59e0b', // Amber
      iconName: 'activity'
    },
    {
      id: 'reading',
      nameBn: 'বৈজ্ঞানিক রিডিং ও আরজে (Reading)',
      nameEn: 'Scientific Reading Lab',
      seconds: Math.max(0, timeBreakdown.readingSeconds),
      color: '#a855f7', // Purple
      iconName: 'book'
    },
    {
      id: 'recovery',
      nameBn: 'রিকভারি ও স্লিপ (Recovery)',
      nameEn: 'Recovery & Rest',
      seconds: Math.max(0, timeBreakdown.recoverySeconds),
      color: '#6366f1', // Indigo
      iconName: 'moon'
    }
  ];

  const totalCalculatedSeconds = rawData.reduce((sum, d) => sum + d.seconds, 0);
  const totalMin = Math.floor(totalCalculatedSeconds / 60);
  const totalSec = totalCalculatedSeconds % 60;
  const goalSeconds = goalMinutes * 60;
  const completionPct = Math.min(100, Math.round((totalCalculatedSeconds / goalSeconds) * 100));

  // If no time is logged yet, provide a gentle visual placeholder breakdown
  const chartData = totalCalculatedSeconds > 0
    ? rawData.filter(d => d.seconds > 0)
    : rawData.map(d => ({ ...d, seconds: 1 }));

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 190;
    const height = 190;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.65;
    const outerRadius = radius * 0.95;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // D3 Pie layout
    const pie = d3
      .pie<DonutSliceData>()
      .value((d) => d.seconds)
      .sort(null)
      .padAngle(0.04);

    // D3 Arc generator
    const arc = d3
      .arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(6);

    const hoverArc = d3
      .arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(outerRadius + 4)
      .cornerRadius(8);

    const arcs = g
      .selectAll('.arc')
      .data(pie(chartData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#090d16')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', hoverArc as any)
          .attr('filter', 'drop-shadow(0px 0px 8px rgba(255,255,255,0.3))');
        setHoveredSlice(d.data);
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc as any)
          .attr('filter', 'none');
        setHoveredSlice(null);
      });

  }, [chartData, totalCalculatedSeconds]);

  const formatSecMin = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3.5 select-none">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {language === 'bn' ? 'কাজের সময়ের চার্ট (Time Spent)' : 'Time Spent Summary'}
          </span>
          <h4 className="text-sm font-extrabold text-white">
            {language === 'bn' ? 'ক্যাটেগরিভিত্তিক অনুশীলনের অনুপাত' : 'Exercise Category Proportions'}
          </h4>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          {completionPct}% {language === 'bn' ? 'টার্গেট' : 'Goal'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-1">
        {/* D3 Donut SVG with central stat */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg ref={svgRef} className="overflow-visible" />

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            <span className="text-xs font-mono font-black text-white leading-none">
              {totalMin}m {totalSec > 0 ? `${totalSec}s` : ''}
            </span>
            <span className="text-[9px] text-slate-400 font-sans mt-0.5">
              {language === 'bn' ? 'মোট সময়' : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="flex-1 w-full space-y-1.5">
          {rawData.map((item) => {
            const isHovered = hoveredSlice?.id === item.id;
            const pct = totalCalculatedSeconds > 0
              ? Math.round((item.seconds / totalCalculatedSeconds) * 100)
              : 0;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredSlice(item)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                  isHovered
                    ? 'bg-slate-900 border-emerald-400/60 shadow-md scale-102'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 font-medium text-[11px] truncate max-w-[140px] sm:max-w-[180px]">
                    {language === 'bn' ? item.nameBn.split('(')[0] : item.nameEn}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-200 font-bold text-[11px]">
                    {formatSecMin(item.seconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
