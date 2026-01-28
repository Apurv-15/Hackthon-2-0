import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TopicData } from '../types';

interface TopicGraphProps {
  data: TopicData;
  isDark?: boolean;
}

export const TopicGraph: React.FC<TopicGraphProps> = ({ data, isDark }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.nodes.length || !svgRef.current) return;

    const width = 300;
    const height = 300;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 3));

    const link = svg.append("g")
      .attr("stroke", isDark ? "#475569" : "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr("stroke", isDark ? "#1e293b" : "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d: any) => d.val)
      .attr("fill", "#3b82f6")
      .call(drag(simulation) as any);

    node.append("title")
      .text((d: any) => d.id);

    // Labels
    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", isDark ? "#94a3b8" : "#475569")
      .style("font-size", "8px")
      .style("font-weight", "500")
      .style("pointer-events", "none")
      .text((d: any) => d.val > 4 ? d.id : "");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y - 8);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [data, isDark]);

  return (
    <div className="w-full h-full flex flex-col">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">Topic Cluster</h4>
      <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-auto bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800" />
    </div>
  );
};
