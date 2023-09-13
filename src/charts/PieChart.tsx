import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
import "./chartStyle.css";
import { ChartData, Point } from "../services/chartCounter";
import { setTableData } from "../services/chartUtils";
import { Margin } from "../services/chartDrawer";
import { DownloadSVGButton } from "../mui/DownloadSVGButton";
import { Divider } from "@mui/material";

export function PieChart(props: props) {
  let data: Point[] = props.data.points.sort((d1, d2) =>
    d1.x.localeCompare(d2.x)
  );
  let height = window.outerHeight * props.height;
  let width = window.outerWidth * props.width;
  let radius = Math.min(width, height) / 2 - 2 * props.margin.top;
  let legendRectSize = 18; // legend
  let legendSpacing = 4; // legend
  const ref = useD3(
    (svg: any) => {
      clear(svg);

      svg = d3
        .select(ref.current)
        .attr("viewBox", [0, 0, width, height - props.margin.bottom * 1.5])
        .append("g")
        .attr(
          "transform",
          "translate(" +
            (width - props.margin.left) / 2 +
            "," +
            height / 2 +
            ")"
        );
      // color blind friendly palette "wong" but without black
      let color = d3
        .scaleOrdinal()
        .domain(props.data.points.map((p) => p.x))
        .range([
          "#E69F00",
          "#56B4E9",
          "#009E73",
          "#F0E442",
          "#0072B2",
          "#D55E00",
          "#CC79A7",
        ]);

      const arcs = d3.pie()(data.map((d) => parseInt(d.y)));
      let arcGenerator = d3
        .arc()
        .padAngle(0.0001)
        .innerRadius(0)
        .outerRadius(radius);
      svg
        .selectAll(".mySlices")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .style("fill", function (d: any) {
          return color(d);
        })
        .attr("stroke", "#282c34")
        .attr("class", "mySlices")
        .attr("data-testid", "slice")
        .style("stroke-width", "2px")
        .style("stroke-opacity", 1)
        .style("opacity", 0.7)

        .on("mouseenter", function (this: any) {
          let values = d3.select(this).data().entries().next().value[1];
          let valueOfCurrent = values.value;
          let itemIndex = values.index;
          let itemOfCurrent = data[itemIndex].x;
          let angle = (values.startAngle + values.endAngle - Math.PI) / 2;
          let anchor =
            Math.abs(Math.cos(angle)) < 1 / 3
              ? "middle"
              : Math.cos(angle) > 0
              ? "start"
              : "end";
          svg
            .selectAll(".mySlices")
            .attr("fill", "url(#grad)")
            .style("opacity", 0.2)
            .attr("stroke", "#282c34")
            .style("stroke-width", "2px")
            .style("stroke-opacity", 1);

          d3.select(this)
            .transition()
            .attr("fill", "Lime")
            .style("opacity", 0.8)
            .attr("stroke", "#282c34")
            .attr("class", "mySlices")
            .attr(
              "transform",
              "translate(" + Math.cos(angle) + "," + Math.sin(angle) + ")"
            );
          svg
            .append("line")
            .attr("id", "link")
            .attr("x1", radius * Math.cos(angle))
            .attr("y1", radius * Math.sin(angle))
            .attr("x2", radius * 1.2 * Math.cos(angle))
            .attr("y2", radius * 1.1 * Math.sin(angle))
            .style("stroke", "white")
            .style("stroke-width", 3);

          svg
            .append("text")
            .attr("x", radius * Math.cos(angle) * 1.3)
            .attr("y", radius * Math.sin(angle) * 1.2)
            .style("text-anchor", anchor)
            .text(
              itemOfCurrent.toString() +
                "\n" +
                Math.round((valueOfCurrent * 100) / props.data.sum).toString() +
                "%"
            )
            .attr("id", "arc-text")
            .attr("class", "text");
        })
        .on("click", function (this: any) {
          let values = d3.select(this).data().entries().next().value[1];
          let itemIndex = values.index;
          let itemOfCurrent = data[itemIndex].papers;

          setTableData(props.setTablePapers, itemOfCurrent);
        })
        .on("mouseleave", function (this: any) {
          d3.selectAll(".mySlices")
            .style("opacity", 0.8)
            .attr("stroke", "#282c34")
            .style("stroke-width", "2px")
            .style("stroke-opacity", 1);
          svg.selectAll("#arc-text").remove();
          svg.selectAll("#link").remove();
          svg.selectAll("#link2").remove();
        });

      //title for the whole diagram
      svg
        .append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + props.margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "text")
        .text(props.diagramTitle);

      //legend
      let legend = svg
        .selectAll(".legend")
        .data(arcs)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d: any, index: number) {
          // get index with alphabetical order, as sorted above
          let height = legendRectSize + legendSpacing;
          let offset = (height * props.data.points.length) / 2;
          let horz = width / 2 - props.margin.right;
          let vert = index * height - offset;
          return "translate(" + horz + "," + vert + ")";
        });

      legend
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", function (d: any) {
          return color(d);
        })
        .style("stroke", color);

      legend
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text(function (this: any) {
          let values = d3.select(this).data().entries().next().value[1];
          let itemIndex = values.index;
          let i = arcs.findIndex((elem) => elem.index == itemIndex);
          let itemOfCurrent = data[i].x;
          return itemOfCurrent;
        });
    },
    [props.data.points]
  );
  return (
    <div>
      <svg
        style={{ fontSize: (window.outerWidth * props.width) / 120 }}
        ref={ref}
        className="svg"
      ></svg>
      <DownloadSVGButton
        ref={ref}
        fileName="PieChart"
        top={1.5 * props.margin.top}
        right={2.5 * props.margin.right}
      />
      <Divider light />
      <br />
    </div>
  );
}

interface props {
  data: ChartData;
  width: number;
  height: number;
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>;
  diagramTitle: string;
  margin: Margin;
}
function clear(svg: any) {
  svg.selectAll(".text").remove();
  svg.selectAll(".mySlices").remove();
  svg.selectAll(".legend").remove();
}
