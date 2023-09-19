import { ChartKeyType, drawChartMap } from "./chartDrawer";
import { ChartData } from "./chartCounter";
import { render, screen } from "@testing-library/react";

test("does not render a bar chart", () => {
  const mockSetTablePapers = jest.fn();
  let data: ChartData = JSON.parse(
    '{"points":[],"sum":0,"item":"Paper Classes"}'
  );
  let result = drawChartMap["BarChart" as ChartKeyType](
    data,
    mockSetTablePapers,
    0.7,
    0.7
  );
  render(result);
  const countElement = screen.getByText(
    "Data is empty, please check your input!"
  );
  expect(countElement).toBeInTheDocument();
});

test("renders a bar chart with one point", () => {
  const mockSetTablePapers = jest.fn();
  let data: ChartData = JSON.parse(
    '{"points":[{"x":1,"y":1}],"sum":1,"item":"Paper Classes"}'
  );
  let result = drawChartMap["BarChart" as ChartKeyType](
    data,
    mockSetTablePapers,
    0.7,
    0.7
  );
  render(result);
  const countElement = screen.getByText(
    "Distribution of Papers over Paper Classes"
  );
  expect(countElement).toBeInTheDocument();
  expect(screen.getAllByTestId("bar")).toHaveLength(1);
});

test("renders a pie chart with one slice", () => {
  const mockSetTablePapers = jest.fn();
  let data: ChartData = JSON.parse(
    '{"points":[{"x":1,"y":1}],"sum":1,"item":"Paper Classes"}'
  );
  let result = drawChartMap["PieChart" as ChartKeyType](
    data,
    mockSetTablePapers,
    0.7,
    0.7
  );
  render(result);
  const countElement = screen.getByText(
    "Distribution of Papers over Paper Classes"
  );
  expect(countElement).toBeInTheDocument();
  expect(screen.getAllByTestId("slice")).toHaveLength(1);
});

test("renders a bubble chart with one bubble", () => {
  const mockSetTablePapers = jest.fn();
  let data: ChartData = JSON.parse(
    '{"points":[{"x":1,"y":1,"papers":["testPaper"]}],"sum":1,"item":"Paper Classes/Years"}'
  );
  let result = drawChartMap["BubbleChart" as ChartKeyType](
    data,
    mockSetTablePapers,
    0.7,
    0.7
  );
  render(result);
  const countElement = screen.getByText(
    "Distribution of Papers over Paper Classes in Terms of Years"
  );
  expect(countElement).toBeInTheDocument();
  expect(screen.getAllByTestId("bubble")).toHaveLength(1);
});
