import { Entry, BibtexParser } from "bibtex-js-parser";
import { BibWrapper } from "../domain/model/BibWrapper";
import { LiteratureClass } from "../domain/model/classes/LiteratureClass";
export function Parser(string: string, parsedClasses: LiteratureClass[]) {
  // pasre input as normale bibtex entry
  const bibJSON = BibtexParser.parseToJSON(string);
  // parse literature classes
  let result = new Array<BibWrapper>();
  if (parsedClasses) {
    parsedClasses.forEach((literatureClass) => {
      let bibElem: BibWrapper = {
        literatureClasses: literatureClass,
        bibEntry: getEntry(literatureClass.citekey, bibJSON),
      };
      result.push(bibElem);
    });
  }

  return result;
}

function getEntry(citekey: string, entries: Entry[]): Entry {
  let entry = entries.find((entry) => entry.id == citekey);
  if (!entry) {
    throw new Error("parsing failed, no bibtex entry found ");
  }
  return entry;
}
