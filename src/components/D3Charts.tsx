import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface D3BarChartProps {
  data: { label: string; value: number }[];
  color: string;
  height?: number;
}

export const D3BarChart: React.FC<D3BarChartProps> = ({ data, color, height = 200 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: { value: number }) => d.value) || 10])
      .nice()
      .range([innerHeight, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth))
      .call(g => g.select(".domain").remove())
      .selectAll(".tick line")
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-dasharray", "3,3");

    g.selectAll(".tick text")
      .attr("fill", "#94a3b8")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(15, 23, 42, 0.95)")
      .style("border", "1px solid rgba(51, 65, 85, 0.6)")
      .style("color", "#f8fafc")
      .style("padding", "6px 10px")
      .style("border-radius", "8px")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)");

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d: { label: string; value: number }) => x(d.label) || 0)
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", color)
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function(event: MouseEvent, d: { label: string; value: number }) {
        d3.select(this).attr("fill", d3.color(color)?.brighter(0.5)?.toString() || color);
        tooltip.style("visibility", "visible")
               .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`);
      })
      .on("mousemove", function(event: MouseEvent) {
        tooltip.style("top", (event.pageY - 40) + "px")
               .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", color);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(800)
      .delay((d: { label: string; value: number }, i: number) => i * 100)
      .attr("y", (d: { label: string; value: number }) => y(d.value))
      .attr("height", (d: { label: string; value: number }) => innerHeight - y(d.value));

    return () => {
      tooltip.remove();
    };
  }, [data, color, height]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible" />
    </div>
  );
};

interface D3LineChartProps {
  data: { label: string; value: number }[];
  color: string;
  height?: number;
}

export const D3LineChart: React.FC<D3LineChartProps> = ({ data, color, height = 200 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: { value: number }) => d.value) || 10])
      .nice()
      .range([innerHeight, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth))
      .call(g => g.select(".domain").remove())
      .selectAll(".tick line")
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-dasharray", "3,3");

    g.selectAll(".tick text")
      .attr("fill", "#94a3b8")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    // Line generator
    const line = d3.line<{ label: string; value: number }>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Area generator
    const area = d3.area<{ label: string; value: number }>()
      .x(d => x(d.label) || 0)
      .y0(innerHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Gradient
    const defs = svg.append("defs");
    const gradientId = `area-gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
    const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.3);
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.0);

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(15, 23, 42, 0.95)")
      .style("border", "1px solid rgba(51, 65, 85, 0.6)")
      .style("color", "#f8fafc")
      .style("padding", "6px 10px")
      .style("border-radius", "8px")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)");

    // Add Area
    g.append("path")
      .datum(data)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add Line
    const path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const totalLength = path.node()?.getTotalLength() || 0;

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add Dots
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d: { label: string; value: number }) => x(d.label) || 0)
      .attr("cy", (d: { label: string; value: number }) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#0f172a")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .on("mouseover", function(event: MouseEvent, d: { label: string; value: number }) {
        d3.select(this).attr("r", 6).attr("fill", color);
        tooltip.style("visibility", "visible")
               .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`);
      })
      .on("mousemove", function(event: MouseEvent) {
        tooltip.style("top", (event.pageY - 40) + "px")
               .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4).attr("fill", "#0f172a");
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .delay((d: { label: string; value: number }, i: number) => (i * (1500 / data.length)))
      .duration(200)
      .style("opacity", 1);

    return () => {
      tooltip.remove();
    };
  }, [data, color, height]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible" />
    </div>
  );
};
