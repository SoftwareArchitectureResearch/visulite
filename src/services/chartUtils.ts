/**
 * changes the value of papers to be shown in layaout component
 * @param setTablePapers setter of table papers in layout
 * @param papers the new value of papers to be shown in layout
 */
export function setTableData(
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>,
  papers: string[]
) {
  setTablePapers(papers);
}

/**
 * calculate the angle with which text of an axis should be rotated
 * @param textSize the size of text in axis
 * @param diagramSize the size of diagram
 * @returns the angle with which text of the axes should be rotated
 */
export function calculateTextAngle(textSize: number, diagramSize: number) {
  if (textSize < 0.8 * diagramSize) {
    return 0;
  }
  if (textSize < 1.2 * diagramSize) {
    return 10;
  }
  if (textSize < 2 * diagramSize) {
    return 45;
  }
  if (textSize >= 2 * diagramSize) {
    return 60;
  }
  return 0;
}
