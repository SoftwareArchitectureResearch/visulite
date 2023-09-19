import { calculateTextAngle } from "./chartUtils";
test("calculates 0 as axis text rotation angle", () => {
  let angle = calculateTextAngle(7, 10);
  expect(angle).toBe(0);
});
test("calculates 10 as axis text rotation angle", () => {
  let angle = calculateTextAngle(11, 10);
  expect(angle).toBe(10);
});
test("calculates 45 as axis text rotation angle", () => {
  let angle = calculateTextAngle(19, 10);
  expect(angle).toBe(45);
});
test("calculates 60 as axis text rotation angle", () => {
  let angle = calculateTextAngle(21, 10);
  expect(angle).toBe(60);
});
