import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
import { ChartData, Point } from "../services/chartCounter";
import { calculateTextAngle, setTableData } from "../services/chartUtils";
import { Margin } from "../services/chartDrawer";
import { DownloadSVGButton } from "../mui/DownloadSVGButton";
import { Divider } from "@mui/material";

/**
 * renders a BarChart based on input data
 * @param props necessary data for rendering barChar,
 * @returns a BarChart Component fed with input data
 */

export function BarChart(props: BarChartInput) {
  const ref = useD3(
    (svg: any) => {
      //sort data
      let data = props.data.points.sort((d1, d2) => d1.x.localeCompare(d2.x));
      let width = window.outerWidth * props.width;
      let height = window.outerHeight * props.height;

      clear(svg);

      //this value is relevant for the text rotation in xAxis and for the calculation of margin
      let textLength = data
        .map((d: Point) => d.x.length)
        .reduce((a: number, b: number) => a + b);
      let xAngle = calculateTextAngle(
        textLength * 7,
        width - props.margin.left - props.margin.right
      );
      svg = d3
        .select(ref.current)
        .attr("viewBox", [
          -0.5 * props.margin.left,
          -0.25 * props.margin.top,
          width + props.margin.right,
          height +
            props.margin.bottom * (Math.max(0.5, Math.sin(xAngle)) - 0.5),
        ]);

      let x = setAbscisseValues(data, props.margin, width);

      // g.length > 0 should be
      let y = setOrdinateValues(data, props.margin, height);

      let xAxis = setXAxis(data, props.margin, height, x);

      let yAxis = setYAxis(props.margin, y);

      const bars = svg
        .append("g")
        .attr("fill", "#E69F00")
        .attr("fill-opacity", 0.8)
        .selectAll("rect")
        .data(data);

      bars
        .join("rect")
        .attr("class", "bar")
        .attr("data-testid", "bar")
        .attr("x", (g: Point) => x(g.x)!)
        .attr("width", x.bandwidth)
        .attr("y", (g: Point) => y(parseInt(g.y)))
        .attr("height", (g: Point) => y(0) - y(parseInt(g.y)))

        .on("mouseenter", function (this: any) {
          let valueOfCurrent = parseInt(
            d3.select(this).data().entries().next().value[1].y
          );

          let itemOfCurrent = d3.select(this).data().entries().next()
            .value[1].x;
          // style all bars
          d3.selectAll("rect")
            .attr("fill-opacity", 0.2)
            .attr("x", (g: any) => x(g.x)! + 5)
            .attr("width", x.bandwidth() - 10)
            .attr("y", (g: any) => y(parseInt(g.y)) + 2)
            .attr(
              "height",
              (g: any) => y(0) - y(parseInt(g.y)) - Math.min(parseInt(g.y), 4)
            )
            .append("text")
            .attr("fill", "white")
            .attr("text-anchor", "middle");
          // style current bar
          d3.select(this)
            .transition()
            .attr("fill-opacity", 0.8)
            .attr("fill", "#009E73")
            .attr("x", (g: any) => x(g.x)! - 5)
            .attr("width", x.bandwidth() + 10)
            .attr("y", (g: any) => y(parseInt(g.y)) - 2)
            .attr("height", (g: any) => y(0) - y(parseInt(g.y)) + 4)
            .text((d: any) => {
              svg
                .append("text")
                .attr("id", "bar-text")
                .attr("class", "text")
                .attr("x", x(d.x)! + x.bandwidth() / 2)
                .attr("y", y(parseInt(d.y)) - 10)
                .attr("text-anchor", "middle")
                .text(Math.round((parseInt(d.y) / props.data.sum) * 100) + "%");
              svg
                .append("text")
                .attr("id", "value-of-bar")
                .style("font-size", "1.5<cem")
                .style("fill", "white")
                .attr("x", (props.margin.left * 8) / 7)
                .attr("y", y(parseInt(d.y)) - 5)
                .attr("text-anchor", "middle")
                .text(d.y);
              return parseInt(d.y);
            });

          svg
            .append("line")
            .attr("id", "limit")
            .attr("x1", props.margin.left)
            .attr("y1", y(valueOfCurrent))
            .attr("x2", x(itemOfCurrent))
            .attr("y2", y(valueOfCurrent))
            .style("stroke", "red")
            .style("stroke-width", 3)
            .style("stroke-dasharray", "3 6");
        })
        .on("click", function (this: any) {
          let itemOfCurrent = d3.select(this).data().entries().next()
            .value[1].papers;
          setTableData(props.setTablePapers, itemOfCurrent);
        })
        .on("mouseleave", function (this: any) {
          d3.selectAll("rect")
            .attr("fill", "#E69F00")
            .attr("fill-opacity", 0.8)
            .attr("x", (g: any) => x(g.x)!)
            .attr("width", x.bandwidth)
            .attr("y", (g: any) => y(parseInt(g.y)))
            .attr("height", (g: any) => y(0) - y(parseInt(g.y)));
          svg.selectAll("#bar-text").remove();
          svg.selectAll("#value-of-bar").remove();
          svg.selectAll("#limit").remove();
        });

      let textAnchor = xAngle == 0 ? "middle" : "end";
      svg
        .append("g")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", textAnchor)
        .attr("transform", `rotate(-${xAngle})`)
        .style("font-size", "1.5em")

        .attr("class", "text");
      svg.append("g").style("font-size", "1.5em").call(yAxis);

      //title for the whole diagram
      svg
        .append("text")
        .attr("class", "text")
        .attr("x", width / 2)
        .attr("y", props.margin.top)
        .attr("text-anchor", "middle")
        .text(props.diagramTitle);

      //title for y axis
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", (props.margin.left * 2) / 3)
        .attr("text-anchor", "middle")
        .attr("class", "text")
        .text(props.ordinateName);

      //title for x axis
      svg
        .append("text")
        .attr("x", width / 2)
        .attr(
          "y",
          height +
            props.margin.bottom * (Math.max(0.5, Math.sin(xAngle)) - 1.25)
        )
        .attr("text-anchor", "middle")
        .attr("class", "text")
        .text(props.abscisseName);
    },
    [props.data.points]
  );
  return (
    <div>
      <svg
        style={{ fontSize: (window.outerWidth * props.width) / 120 }}
        ref={ref}
        className="svg "
      ></svg>
      <DownloadSVGButton
        ref={ref}
        fileName="BarChart"
        top={1.75 * props.margin.top}
        right={2.5 * props.margin.right}
      />
      <Divider light />
      <br />
    </div>
  );
}

/**
 * input data for rendering barChart:
 * data: content
 * width and height: dimensions
 * setTablePapers: needed to update the list of papers to be shown in table
 * @interface
 */
interface BarChartInput {
  data: ChartData;
  width: number;
  height: number;
  diagramTitle: string;
  abscisseName: string;
  ordinateName: string;
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>;
  margin: Margin;
}

function clear(svg: any) {
  svg.selectAll(".text").remove();
  svg.selectAll(".bar").remove();
  svg.selectAll(".axis").remove();
}

function setAbscisseValues(data: Point[], margin: Margin, width: number) {
  let x = d3
    .scaleBand()
    .domain(data.map((d) => d.x))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.4);
  return x;
}

function setOrdinateValues(data: Point[], margin: Margin, height: number) {
  let y = d3
    .scaleLinear()
    .domain([
      0,
      (Math.floor(
        (d3.max(data.map((point: Point) => parseInt(point.y))) as number) / 5
      ) +
        Math.floor(
          // permits to have exact maximal value in the y axis
          (((d3.max(data.map((point: Point) => parseInt(point.y))) as number) %
            5) +
            4) /
            5
        )) *
        5,
    ])
    .rangeRound([height - 2 * margin.bottom, 2 * margin.top]);
  return y;
}

function setXAxis(
  data: Point[],
  margin: Margin,
  height: number,
  x: d3.ScaleBand<string>
) {
  let xAxis = (g: any) =>
    g
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - 2 * margin.bottom})`)
      .call(
        d3
          .axisBottom(x)

          .tickFormat(function (d, i) {
            return data[i].x;
          })

          .tickSizeOuter(0)
      );
  return xAxis;
}

function setYAxis(margin: Margin, y: d3.ScaleLinear<number, number, never>) {
  let yAxis = (g: any) =>
    g
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .style("font-size", "1.5em")
      .call(d3.axisLeft(y).ticks(5));
  return yAxis;
}
