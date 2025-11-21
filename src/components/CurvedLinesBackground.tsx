'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { contours } from 'd3-contour';
import { geoTransform } from 'd3-geo';

export default function CurvedLinesBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1920;
    const height = 1080;
    const n = 200;
    const m = 200;

    // Generate data using noise function
    const data: number[][] = [];
    
    for (let j = 0; j < m; j++) {
      const row: number[] = [];
      for (let i = 0; i < n; i++) {
        const x = (i / n) * 6;
        const y = (j / m) * 6;
        const value = 
          Math.sin(x * 0.4) * Math.cos(y * 0.4) * 1.0 +
          Math.sin(x * 0.8) * Math.cos(y * 0.8) * 0.7 +
          Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.5 +
          Math.sin(x * 0.6) * Math.cos(y * 1.0) * 0.6 +
          Math.sin(x * 2.0) * Math.cos(y * 2.0) * 0.3;
        row.push(value);
      }
      data.push(row);
    }

    // Find min and max for normalization
    let minValue = Infinity;
    let maxValue = -Infinity;
    data.forEach(row => {
      row.forEach(val => {
        minValue = Math.min(minValue, val);
        maxValue = Math.max(maxValue, val);
      });
    });

    // Normalize data to 0-1 range and flatten to 1D array (row-major order)
    const normalizedData: number[] = [];
    data.forEach(row => {
      row.forEach(val => {
        normalizedData.push((val - minValue) / (maxValue - minValue));
      });
    });

    // Create contour generator
    const numThresholds = 25;
    const thresholds = d3.range(0.1, 0.9, 0.8 / numThresholds);
    
    const contourGenerator = contours()
      .size([n, m])
      .thresholds(thresholds);

    const contourData = contourGenerator(normalizedData);

    console.log('First contour:', JSON.stringify(contourData[0], null, 2).substring(0, 500));

    // Scale factors - different for X and Y to fill the viewBox
    const scaleX = width / n;
    const scaleY = height / m;

    // Use geoTransform to scale X and Y independently
    const transform = geoTransform({
      point: function(x, y) {
        this.stream.point(x * scaleX, y * scaleY);
      }
    });

    const path = d3.geoPath(transform);

    // Draw contours using geoPath
    const paths = svg.selectAll('path')
      .data(contourData)
      .enter()
      .append('path');

    paths
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1.5)
      .style('stroke', '#000000')
      .style('stroke-width', '1.5px')
      .style('opacity', '1')
      .style('fill', 'none');

    console.log('Paths created:', paths.size());
    
    // Check if paths have valid d attributes
    paths.each(function(d, i) {
      if (i < 3) {
        const dAttr = this.getAttribute('d');
        console.log(`Path ${i} d attribute:`, dAttr ? dAttr.substring(0, 100) : 'empty');
      }
    });
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ 
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
