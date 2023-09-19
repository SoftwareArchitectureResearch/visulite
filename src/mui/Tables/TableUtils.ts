/**
 * represents necessary information for table columns
 * id: identifies the column is the label in camelCase.
 * label: the title of column to be shown in the UI.
 */
export interface ElementInformation {
  id: string;
  label: string;
}

/**
 * returns the index of an element with a given id
 * @param id the id of the element to be found
 */
export function getElementIndexById(
  id: string,
  sourceArray: ElementInformation[]
) {
  let filteredArray = sourceArray.filter((elem) => elem.id === id);
  if (filteredArray != null && filteredArray.length > 0) {
    return sourceArray.indexOf(filteredArray[0]);
  }
  console.error(`error: no element with id ${id} was found.`);
  return -1;
}
