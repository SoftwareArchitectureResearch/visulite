import { Alert, Snackbar } from "@mui/material";
import { BarChart } from "../charts/BarChart";
import { BubbleChart } from "../charts/BubbleChart";
import { PieChart } from "../charts/PieChart";
import { ChartData } from "./chartCounter";

/**
 * according to the given data and chart type a chart will be rendered
 * The input includes: chart data, setTablePapers in order to update
 * which papers should be shown in the table after clicking on the chart ,
 * and chart dimensions.
 * @param props input and type of the chart to be rendered
 * @returns a chart component that will be rendered
 */
export function CurrentChart(props: DrawChartInput) {
  return drawChartMap[props.chartType as ChartKeyType](
    props.data,
    props.setTablePapers,
    0.7,
    0.7
  );
}

/**
 * maps every key (describing the type of Chart to be visualized) to a function
 * that return a chart of the specified type.
 */
export const drawChartMap: FunctionMap = {
  BarChart: (
    data: ChartData,
    setTablePapers: React.Dispatch<React.SetStateAction<string[]>>,
    height: number,
    width: number
  ) => {
    if (data.points.length === 0) {
      return (
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={true}
          >
            <Alert severity="warning">
              {"Data is empty, please check your input!"}
            </Alert>
          </Snackbar>
        </div>
      );
    }
    return (
      <BarChart
        data={data}
        height={height}
        width={width}
        setTablePapers={setTablePapers}
        diagramTitle={"Distribution of Papers over " + data.item}
        abscisseName={data.item}
        ordinateName={"Number of Papers over " + data.item}
        margin={new Margin()}
      ></BarChart>
    );
  },
  PieChart: (
    data: ChartData,
    setTablePapers: React.Dispatch<React.SetStateAction<string[]>>,
    height: number,
    width: number
  ) => {
    if (data.points.length === 0) {
      return (
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={true}
          >
            <Alert severity="warning">
              {"Data is empty, please check your input!"}
            </Alert>
          </Snackbar>
        </div>
      );
    }
    return (
      <PieChart
        data={data}
        height={height}
        width={height}
        setTablePapers={setTablePapers}
        diagramTitle={"Distribution of Papers over " + data.item}
        margin={new Margin()}
      ></PieChart>
    );
  },
  BubbleChart: (
    data: ChartData,
    setTablePapers: React.Dispatch<React.SetStateAction<string[]>>,
    height: number,
    width: number
  ) => {
    if (data.points.length === 0) {
      return (
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={true}
          >
            <Alert severity="warning">
              {"Data is empty, please check your input!"}
            </Alert>
          </Snackbar>
        </div>
      );
    }
    let items = data.item.split("/");
    return (
      <BubbleChart
        data={data}
        height={height}
        width={width}
        setTablePapers={setTablePapers}
        diagramTitle={
          "Distribution of Papers over " + items[0] + " in Terms of " + items[1]
        }
        abscisseName={data.item}
        margin={new Margin()}
      ></BubbleChart>
    );
  },
};

/**
 * maps a chartType to a boolean, to know whether two selectors are needed
 */
export const twoInputsNeeded: BooleanMap = {
  BarChart: false,
  PieChart: false,
  BubbleChart: true,
};

interface DrawChartInput {
  data: ChartData;
  chartType: string;
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>;
}
/**
 * the margin of every chart that will be rendered
 */
export class Margin {
  top = window.outerHeight * 0.1;
  right = window.outerWidth * 0.1;
  bottom = window.outerHeight * 0.1;
  left = window.outerWidth * 0.1;
}
/**
 * maps a string value to a chart component
 */
interface FunctionMap {
  [key: string]: (
    data: ChartData,
    setTablePapers: React.Dispatch<React.SetStateAction<string[]>>,
    height: number,
    width: number
  ) => React.JSX.Element;
}

/**
 * the type of function key in the chart counter's function map
 */
export type ChartKeyType = keyof FunctionMap;

/**
 * maps a chart type to a boolean value of whether two selectors are needed
 */
interface BooleanMap {
  [key: string]: boolean;
}

/**
 * the type of key of the BooleanMap
 */
export type BooleanKeyType = keyof BooleanMap;
