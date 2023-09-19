import { DataKeyType, processDataMap } from "./chartCounter";

test("returns empty chartData  of type Paper Classes based on input", () => {
  let result = processDataMap["PaperClass" as DataKeyType]([]);
  expect(JSON.stringify(result)).toBe(
    '{"points":[],"sum":0,"item":"Paper Classes"}'
  );
});

test("returns empty chartData  of type Evaluation Method based on input", () => {
  let result = processDataMap["EvaluationMethod" as DataKeyType]([]);
  expect(JSON.stringify(result)).toBe(
    '{"points":[],"sum":0,"item":"Evaluation Methods"}'
  );
});

test("returns empty chartData  of type Year based on input", () => {
  let result = processDataMap["Year" as DataKeyType]([]);
  expect(JSON.stringify(result)).toBe('{"points":[],"sum":0,"item":"Years"}');
});
