import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useRef, useState } from "react";

import {
  ChartData,
  DataKeyType,
  Point,
  processDataMap,
} from "../services/chartCounter";
import {
  BooleanKeyType,
  drawChartMap,
  twoInputsNeeded,
} from "../services/chartDrawer";
import { BibWrapper } from "../domain/model/BibWrapper";

/**
 * This component is composed of thre selectors, one for chart type and two for data types for chart input calculation
 *  @param props input of the selecotr
 * bibData: containg the papers to be visualized
 * theme: is the theme of MUI components
 * setChartInput: is a setter to set the chart input stored as state in layout
 * setchart: is a setter to set the type of chart to be visualized
 
 * @returns three s
 */
export default function SelectOptions(props: props) {
  const [chartType, setChartType] = useState(Object.keys(drawChartMap)[0]);
  const [dataType, setDataType] = useState(Object.keys(processDataMap)[0]);
  const [secondDataType, setSecondDataType] = useState(
    Object.keys(processDataMap)[2]
  );
  let firstItemData = useRef(
    processDataMap["PaperClass" as DataKeyType](props.bibData)
  );
  let secondItemData = useRef(
    processDataMap["Year" as DataKeyType](props.bibData)
  );
  let sndSelectorEnabled = useRef(false);
  let chartInput = useRef(
    processDataMap["PaperClass" as DataKeyType](props.bibData)
  );

  const handleChartChange = (event: SelectChangeEvent) => {
    props.setChart(event.target.value);
    sndSelectorEnabled.current =
      twoInputsNeeded[event.target.value as BooleanKeyType];
    if (!sndSelectorEnabled.current) {
      chartInput.current = firstItemData.current;
    } else {
      chartInput.current = mergeData(
        firstItemData.current,
        secondItemData.current
      );
    }

    props.setChartInput(chartInput.current);

    setChartType(event.target.value);
  };

  const handleDataChange = (event: SelectChangeEvent) => {
    firstItemData.current = processDataMap[event.target.value as DataKeyType](
      props.bibData
    );
    chartInput.current = firstItemData.current;
    if (sndSelectorEnabled.current) {
      chartInput.current = mergeData(
        firstItemData.current,
        secondItemData.current
      );
    }
    props.setChartInput(chartInput.current);
    setDataType(event.target.value);
  };

  const handlesSecondItemChange = (event: SelectChangeEvent) => {
    secondItemData.current = processDataMap[event.target.value as DataKeyType](
      props.bibData
    );
    chartInput.current = mergeData(
      firstItemData.current,
      secondItemData.current
    );
    props.setChartInput(chartInput.current);
    setSecondDataType(event.target.value);
    return;
  };

  return (
    <>
      <FormControl sx={{ m: 1, margin: { padEnd: 0 } }} size="small">
        <InputLabel id="select-chart-type-label">Chart Type</InputLabel>
        <Select
          labelId="select-chart-type-label"
          id="select-chart-type"
          label="ChartType"
          value={chartType}
          onChange={handleChartChange}
        >
          {Object.keys(drawChartMap).map((name) => (
            <MenuItem key={name} value={name}>
              {getName(name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <InputLabel id="select-data-label">First Item</InputLabel>
        <Select
          labelId="select-data-label"
          id="select-data"
          label="DataType"
          value={dataType}
          onChange={handleDataChange}
        >
          {Object.keys(processDataMap).map((name) => (
            <MenuItem key={name} value={name}>
              {getName(name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <InputLabel id="select-data-label">Second Item</InputLabel>
        <Select
          labelId="select-data-label"
          id="select-data"
          label="DataType"
          value={secondDataType}
          onChange={handlesSecondItemChange}
          disabled={!sndSelectorEnabled.current}
        >
          {Object.keys(processDataMap).map((name) => (
            <MenuItem key={name} value={name}>
              {getName(name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

function getName(string: string) {
  return string.split(/(?=[A-Z])/).join(" ");
}
/**
 * input of the selecotr
 * bibData: containg the papers to be visualized
 * theme: is the theme of MUI components
 * setChartInput: is a setter to set the chart input stored as state in layout
 * setchart: is a setter to set the type of chart to be visualized
 */
interface props {
  bibData: BibWrapper[];
  theme: any;
  setChartInput: any;
  setChart: any;
}
function mergeData(firstData: ChartData, secondData: ChartData): ChartData {
  let result: ChartData;
  let points: Point[] = firstData.points.flatMap((first) => {
    let tempPoints = secondData.points.map((second) => {
      let commonPapers = first.papers.filter((firstPaper) =>
        second.papers.find((secondPaper) => secondPaper == firstPaper)
      );
      return { x: first.x, y: second.x, papers: commonPapers };
    });
    return tempPoints;
  });

  result = {
    points: points,
    sum: points.length,
    item: firstData.item + "/" + secondData.item,
  };
  return result;
}
