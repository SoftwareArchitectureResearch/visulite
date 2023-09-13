import { BibWrapper } from "../domain/model/BibWrapper";
import { EvaluationMethod } from "../domain/model/classes/Evaluation";
import { PaperClass } from "../domain/model/classes/Metadata";

/**
 * maps every key (describing the item to be visualized) to a function
 * that prepares data accordingly
 */
export const processDataMap: FunctionMap = {
  PaperClass: (input: BibWrapper[]) => {
    return countPaperClasses(input);
  },
  EvaluationMethod: (input: BibWrapper[]) => {
    return countEvaluationMethods(input);
  },
  Year: (input: BibWrapper[]) => {
    return countYears(input);
  },
};

/**
 * processes data to prepare it to visualise the distribution of paper classes
 * @param input internal model parsed from bibtex
 * @returns data representing paper classes and their distributions
 */
function countPaperClasses(input: BibWrapper[]): ChartData {
  let paperClasses = Object.values(PaperClass);
  let data: Point[] = [];
  data.length = paperClasses.length;

  //init
  for (let i = 0; i < data.length; i++) {
    data[i] = { x: paperClasses[i].toString(), y: "0", papers: [] };
  }

  input.forEach((entry) => {
    entry.literatureClasses.metadata.paperClass.forEach((paperClass) => {
      let newValue = parseInt(data[paperClasses.indexOf(paperClass)].y) + 1;
      data[paperClasses.indexOf(paperClass)].y = newValue.toString();
      data[paperClasses.indexOf(paperClass)].papers.push(
        entry.literatureClasses.citekey
      );
    });
  });
  let total = 0;
  data.forEach((point) => {
    total = total + parseInt(point.y);
  });
  let chartData: ChartData = {
    points: data.filter((elem) => parseInt(elem.y) > 0),
    sum: total,
    item: "Paper Classes",
  };
  return chartData;
}

function countEvaluationMethods(input: BibWrapper[]): ChartData {
  let evaluationMethods = Object.values(EvaluationMethod);
  let data: Point[] = [];
  data.length = evaluationMethods.length;
  let paperData: Point[] = [];
  paperData.length = evaluationMethods.length;

  //init
  for (let i = 0; i < data.length; i++) {
    data[i] = { x: evaluationMethods[i].toString(), y: "0", papers: [] };
  }

  input.forEach((entry) => {
    for (let i = 0; i < data.length; i++) {
      paperData[i] = { x: evaluationMethods[i].toString(), y: "0", papers: [] };
    }
    entry.literatureClasses.content.researchObjects.forEach(
      (researchObject) => {
        researchObject.evaluations.forEach((evaluation) => {
          evaluation.evaluationMethods.forEach((method) => {
            let newValue =
              parseInt(paperData[evaluationMethods.indexOf(method)].y) + 1;
            paperData[evaluationMethods.indexOf(method)].y =
              newValue.toString();
          });
        });
      }
    );
    for (let i = 0; i < data.length; i++) {
      let currentValue = parseInt(data[i].y);
      data[i].y =
        parseInt(paperData[i].y) > 0
          ? (currentValue + 1).toString()
          : currentValue.toString();
      if (parseInt(paperData[i].y) > 0)
        data[i].papers.push(entry.literatureClasses.citekey);
    }
  });
  let total = 0;
  data.forEach((d) => {
    total = total + parseInt(d.y);
  });
  let chartData: ChartData = {
    points: data.filter((elem) => parseInt(elem.y) > 0),
    sum: total,
    item: "Evaluation Methods",
  };
  return chartData;
}

function countYears(input: BibWrapper[]): ChartData {
  let years = Array.from(
    new Set(
      input.map((paper) =>
        paper.bibEntry.year ? parseInt(paper.bibEntry.year.toString()) : 0
      )
    )
  );
  years = years.sort();
  let data: Point[] = [];
  data.length = years.length;
  let paperData: Point[] = [];
  paperData.length = years.length;

  //init
  for (let i = 0; i < data.length; i++) {
    data[i] = { x: years[i].toString(), y: "0", papers: [] };
  }

  input.forEach((entry) => {
    for (let i = 0; i < data.length; i++) {
      paperData[i] = { x: years[i].toString(), y: "0", papers: [] };
    }
    if (entry.bibEntry.year) {
      let newValue =
        parseInt(
          data[years.indexOf(parseInt(entry.bibEntry.year.toString()))].y
        ) + 1;
      data[years.indexOf(parseInt(entry.bibEntry.year.toString()))].y =
        newValue.toString();
      data[years.indexOf(parseInt(entry.bibEntry.year.toString()))].papers.push(
        entry.literatureClasses.citekey
      );
    }
  });
  let total = 0;
  data.forEach((d) => {
    total = total + parseInt(d.y);
  });
  let chartData: ChartData = {
    points: data.filter((elem) => parseInt(elem.y) > 0),
    sum: total,
    item: "Years",
  };
  return chartData;
}

/**
 * represents a single element with abscisse, ordinate
 * and a list of paper keys of papers it represents
 *@interface
 */
export interface Point {
  x: string;
  y: string;
  papers: string[];
}

/**
 * input data to draw chart including, "points" to be represented,
 * "sum" of ordinates, diagram title, item name (title of item to be visualised)
 * and value name (title values associated to the presented properties)
 * @interface
 */
export interface ChartData {
  points: Point[];
  sum: number;
  item: string;
}
interface FunctionMap {
  [key: string]: (data: BibWrapper[]) => ChartData;
}

/**
 * the type of function key in the chart counter's function map
 */
export type DataKeyType = keyof FunctionMap;
