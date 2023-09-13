import { ElementInformation, getElementIndexById } from "./TableUtils";

test("returns valid index", () => {
  let inputArray: ElementInformation[] = [{ id: "testId", label: "testid" }];
  let result = getElementIndexById("testId", inputArray);
  expect(JSON.stringify(result)).toBe("0");
});

test("returns error", () => {
  let inputArray: ElementInformation[] = [{ id: "testId", label: "testid" }];
  jest.spyOn(console, "error");
  getElementIndexById("testWrongId", inputArray);
  expect(console.error).toHaveBeenCalledWith(
    "error: no element with id testWrongId was found."
  );
});
