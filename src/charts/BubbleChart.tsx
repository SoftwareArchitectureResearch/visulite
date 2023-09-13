import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
import { ChartData, Point } from "../services/chartCounter";

import { calculateTextAngle, setTableData } from "../services/chartUtils";
import { Margin } from "../services/chartDrawer";
import { DownloadSVGButton } from "../mui/DownloadSVGButton";
import { Divider, Grid } from "@mui/material";

export function BubbleChart(props: BubbleChartInput) {
  let data: Point[] = props.data.points.sort((d1, d2) =>
    d1.y.localeCompare(d2.y)
  );
  let height = window.outerHeight * props.height;
  let width = window.outerWidth * props.width;
  const ref = useD3(
    (svg: any) => {
      clear(svg);
      let xTextLength = Array.from(new Set(data.map((d) => d.y)))
        .map((y: string) => y.length)
        .reduce((a: number, b: number) => a + b);

      //this value is relevant for the text rotation in xAxis and for the calculation of margin
      let xAngle = calculateTextAngle(
        xTextLength * 7,
        width - props.margin.left * 1.5 - props.margin.right * 0.5
      );
      let boxHeight = height - props.margin.bottom * (1 - Math.sin(xAngle));
      d3.select(ref.current).attr("viewBox", [
        -0.5 * props.margin.left,
        -0.5 * props.margin.top,
        width + props.margin.right,
        boxHeight,
      ]);
      // color blind friendly palette "wong" but without black
      let color = d3
        .scaleOrdinal()
        .domain(Array.from(new Set(props.data.points.map((p) => p.x))))
        .range([
          "#E69F00",
          "#56B4E9",
          "#009E73",
          "#F0E442",
          "#0072B2",
          "#D55E00",
          "#CC79A7",
        ]);
      //abscisse
      let x = d3
        .scalePoint()
        .domain(Array.from(new Set(data.map((d) => d.y))))
        .rangeRound([1.5 * props.margin.left, width - 0.5 * props.margin.right])
        .padding(0.4);

      let textAnchor = xAngle == 0 ? "middle" : "end";
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - 2 * props.margin.bottom})`)
        .style("font-size", "1.5em")
        .call(
          d3
            .axisBottom(x)
            .ticks(Array.from(new Set(data.map((d) => d.y))).length)
            .tickSizeOuter(0)
        )
        .selectAll("text")
        .style("text-anchor", textAnchor)
        .attr("transform", `rotate(-${xAngle})`);

      //ordinate
      let y = d3
        .scalePoint()
        .domain(Array.from(new Set(data.map((d) => d.x))))
        .rangeRound([height - 2 * props.margin.bottom, 2 * props.margin.top])
        .padding(0.4);

      svg
        .append("g")
        .attr("class", "axis")
        .style("font-size", "1.5em")

        .attr("transform", `translate(${1.5 * props.margin.left},0)`)
        .call(
          d3
            .axisLeft(y)

            .ticks(Array.from(new Set(data.map((d) => d.x))).length)
            .tickSizeOuter(0)
        )
        .selectAll("text")
        .style("text-anchor", "end");
      //radius
      let z = d3
        .scaleSqrt()
        .domain([0, Math.max(...data.map((d) => d.papers.length))])
        .range([0, 10]);

      // Add dots
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d: Point) {
          return "bubbles " + d.papers;
        })
        .attr("id", "bubble")
        .attr("data-testid", "bubble")
        .attr("cx", function (d: Point) {
          return x(d.y);
        })
        .attr("cy", function (d: Point) {
          return y(d.x) as number;
        })
        .attr("r", function (d: Point) {
          return z(d.papers.length);
        })
        .style("fill", function (d: Point) {
          return color(d.x);
        })
        // -3- Trigger the functions for hover
        .on("mouseenter", function (this: any, event: MouseEvent, d: Point) {
          let valueOfCurrent = d3.select(this).data().entries().next()
            .value[1].x;
          let itemOfCurrent = d3.select(this).data().entries().next()
            .value[1].y;
          let sum = d3.select(this).data().entries().next().value[1]
            .papers.length;
          svg
            .selectAll("#bubble")
            .transition()
            .attr("r", function (d: Point) {
              return z(d.papers.length * 0.5);
            });
          d3.select(this)
            .transition()
            .attr("r", (d: any) => {
              return z(d.papers.length * 2);
            });
          let toolTipWidth =
            Math.max(valueOfCurrent.length + 2, itemOfCurrent.length + 2) * 12;
          let toolTipHeight = 80;
          let xTooltip =
            width - 1.5 * toolTipWidth > (x(itemOfCurrent) as number) + 20
              ? (x(itemOfCurrent) as number) + 20
              : (x(itemOfCurrent) as number) - toolTipWidth - 20;
          let yTooltip =
            boxHeight - 0.5 * props.margin.top - toolTipHeight >
            (y(valueOfCurrent) as number) - 10
              ? (y(valueOfCurrent) as number) + 10
              : (y(valueOfCurrent) as number) + 10 - toolTipHeight;

          svg
            .append("rect")
            .attr("id", "tooltip")
            .style("opacity", "0.7")
            .style("fill", "grey")
            .style("rx", "5")
            .style("y", +yTooltip + "px")
            .style("x", xTooltip + "px")
            .style("height", toolTipHeight + "px")
            .style("width", toolTipWidth + "px")
            .text(() => {
              svg
                .append("text")
                .attr("id", "tooltip-text")
                .attr("class", "text")
                .attr("x", xTooltip + 10 + "px")
                .attr("y", yTooltip + 20 + "px")

                .attr("text-anchor", "start")
                .text("x: " + itemOfCurrent.toString());
              svg
                .append("text")
                .attr("id", "tooltip-text")
                .attr("class", "text")
                .attr("x", xTooltip + 10 + "px")
                .attr("y", yTooltip + 40 + "px")

                .attr("text-anchor", "start")
                .text("\n y: " + valueOfCurrent.toString());
              svg
                .append("text")
                .attr("id", "tooltip-text")
                .attr("class", "text")
                .attr("x", xTooltip + 10 + "px")
                .attr("y", yTooltip + 65 + "px")

                .attr("text-anchor", "start")
                .text("\n Sum: " + sum.toString());
            });
        })
        .on("click", function (this: any) {
          let itemOfCurrent = d3.select(this).data().entries().next()
            .value[1].papers;

          setTableData(props.setTablePapers, itemOfCurrent);
        })
        .on("mouseleave", () => {
          svg.selectAll("#limit").remove();
          svg.selectAll("#bubble").attr("r", function (d: Point) {
            return z(d.papers.length * 1);
          });
          d3.selectAll("#tooltip").remove();
          d3.selectAll("#tooltip-text").remove();
        });

      //title for the whole diagram
      svg
        .append("text")
        .attr("class", "text")
        .attr("x", width / 2)
        .attr("y", props.margin.top)
        .attr("text-anchor", "middle")
        .text(props.diagramTitle);
    },
    [props.data]
  );

  return (
    <Grid>
      <svg
        style={{ fontSize: (window.outerWidth * props.width) / 120 }}
        ref={ref}
        className="svg "
      ></svg>
      <DownloadSVGButton
        ref={ref}
        fileName="BubbleChart"
        top={2 * props.margin.top}
        right={2 * props.margin.right}
      />
      <Divider light />
      <br />
    </Grid>
  );
}

export interface BubbleChartInput {
  data: ChartData;
  width: number;
  height: number;
  diagramTitle: string;
  abscisseName: string;
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>;
  margin: Margin;
}

/**
 * Margin in which the chart will be placed
 */

function clear(svg: any) {
  svg.selectAll(".text").remove();
  svg.selectAll(".bubbles").remove();
  svg.selectAll(".legend").remove();
  svg.selectAll(".axis").remove();
}
