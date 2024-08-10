import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import '../../StyleSheets/DashboardMenu.css';

// Render a Donut chart
// Props - data to be to be plotted
// width and height of the chart
// inner and outer radius of the chart to determine the thickness of the donut
// isGrayedOut to conditionally gray out the chart
const DonutChart = ({
    data,
    width,
    height,
    innerRadius,
    outerRadius,
    isGrayedOut,
  }) => {
    const ref = useRef();
  
    const label1 = data[0].label;
    const value1 = data[0].value;
  
    const label2 = data[1].label;
    const value2 = data[1].value;
  
    useEffect(() => {
      // Set the height and width of the svg section
      const svg = d3
        .select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      // Color scheme of the donut sections
      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.label))
        .range(isGrayedOut ? ['#B0B0B0', '#D3D3D3'] : ['#1D9BCE', '#3DD5F3']);
  
      // Pie generator
      const pie = d3.pie().value((d) => d.value);
  
      // Arc generator
      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  
      // Enter selection for paths
      const paths = svg
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .attr('transform', 'rotate(0)');
      
      // Apply animation if not grayed out
      if (!isGrayedOut) {
        paths
          .transition()
          .duration(2000)
          .attrTween('d', function (d) {
            var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d); // Start at angle 0
            return function (t) {
              return arc(interpolate(t));
            };
          })
          .attrTween('transform', function () {
            return d3.interpolateString('rotate(0, 0)', 'rotate(360, 0)'); // Rotate 360 degrees through the path
          });
      }
    }, [data, width, height, innerRadius, outerRadius, isGrayedOut]);
  
    return (
      <div className={`chart-container ${isGrayedOut ? 'grayed-out' : ''}`}>
        <svg ref={ref}></svg>
        <div className="donut-labels">
          {/* Left label styling */}
          <div className="donut-label left">
            <span
              className="color-box"
              style={{ backgroundColor: isGrayedOut ? '#B0B0B0' : '#1D9BCE' }}
            ></span>{' '}
            {label1}: {value1}%
          </div>
          {/* Right label styling */}
          <div className="donut-label right">
            <span
              className="color-box"
              style={{ backgroundColor: isGrayedOut ? '#D3D3D3' : '#3DD5F3' }}
            ></span>{' '}
            {label2}: {value2}%
          </div>
        </div>
      </div>
    );
  };

export default DonutChart;