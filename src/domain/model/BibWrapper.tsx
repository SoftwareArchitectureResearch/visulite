import { Entry } from "bibtex-js-parser";
import { LiteratureClass } from "./classes/LiteratureClass";

/**
 * This interface wrapps the extracted data using an external dependency and internal model together
 */
export interface BibWrapper {
  /**
   * entries extracted by bibtex-parser
   */
  bibEntry: Entry;
  /**
   * internal model
   */
  literatureClasses: LiteratureClass;
}
