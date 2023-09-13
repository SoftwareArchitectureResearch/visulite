import { useDispatch } from "react-redux";
import { Content } from "../domain/model/classes/Content";
import {
  Evaluation,
  EvaluationMethod,
} from "../domain/model/classes/Evaluation";
import { LiteratureClass } from "../domain/model/classes/LiteratureClass";
import {
  PaperClass,
  Metadata,
  DocumentVenue,
  ResearchLevel,
  Kind,
} from "../domain/model/classes/Metadata";
import {
  ResearchObject,
  ResearchObjectType,
} from "../domain/model/classes/ResearchObject";
import {
  State,
  ThreatstoValidity,
  Validity,
} from "../domain/model/classes/Validity";
import { store } from "../redux/stores/store";
import { replace } from "../redux/classesSlice";
import {
  ProductQuality,
  QualityInUse,
  QualityOfAnalyticalMethods,
} from "../domain/model/classes/Properties";

type Enums =
  | (typeof DocumentVenue)[keyof typeof DocumentVenue]
  | (typeof EvaluationMethod)[keyof typeof EvaluationMethod]
  | (typeof Kind)[keyof typeof Kind]
  | (typeof PaperClass)[keyof typeof PaperClass]
  | (typeof ProductQuality)[keyof typeof ProductQuality]
  | (typeof QualityOfAnalyticalMethods)[keyof typeof QualityOfAnalyticalMethods]
  | (typeof QualityInUse)[keyof typeof QualityInUse]
  | (typeof ResearchLevel)[keyof typeof ResearchLevel]
  | (typeof ResearchObjectType)[keyof typeof ResearchObjectType]
  | (typeof State)[keyof typeof State]
  | (typeof ThreatstoValidity)[keyof typeof ThreatstoValidity];

/**
 * The component parses the "classes" part of a bibtex to internal model and
 * stores the result in the application's store.
 * @param string the bibtex input from which class content will be extracted
 * @returns a model representing the bibtex string
 */

export function ClassParser(string: string) {
  const dispatch = useDispatch();
  //separte bibtex entries
  let papers = string.split("@");
  papers = papers.slice(1, papers.length);

  let literatureClasses = new Array<LiteratureClass>(papers.length);
  //get the class description of bibtex
  let classes = "";
  let citekey = "";
  for (let i = 0; i < papers.length; i++) {
    let paper = papers[i];
    citekey = paper.slice(paper.indexOf("{") + 1, paper.indexOf(","));
    classes = paper.slice(
      paper.indexOf("classes = "),
      paper.lastIndexOf("}") - 1
    );
    literatureClasses[i] = parseClasses(citekey, classes);
  }
  dispatch(replace(literatureClasses));
  const literatureClass = store.getState().classes.value;
  return literatureClass;
}

/**
 *
 * @param citekey identifier of a paper
 * @param description the content of "classes" part in bibtex
 * @returns parsed class object for a paper
 */
function parseClasses(citekey: string, description: string): LiteratureClass {
  let metadaDesciption = description.includes("Meta Data{")
    ? getCurlyBracesContent(
        description.slice(description.indexOf("Meta Data"), description.length)
      )
    : "";
  let validityDescription = description.includes("Validity{")
    ? getCurlyBracesContent(
        description.slice(description.indexOf("Validity"), description.length)
      )
    : "";
  let contentDescription = getNextElementsAfter(
    "Meta Data",
    metadaDesciption,
    description
  );
  contentDescription = getNextElementsAfter(
    "Validity",
    validityDescription,
    contentDescription
  );
  let result: LiteratureClass = {
    citekey: citekey,
    metadata: parseMetadata(metadaDesciption),
    validity: parseValidity(validityDescription),
    content: parseContent(contentDescription),
  };
  return result;
}

/**
 * parses content of metada to metadata object
 * @param string content of metadata
 * @returns parsed Metadata object
 */
function parseMetadata(string: string): Metadata {
  let documentVenue = parseStringtoEnum<DocumentVenue>(
    getContentofType("Document Venue", string)
  );
  let researchLevel = parseStringtoEnum<ResearchLevel>(
    getContentofType("Research Level", string).toUpperCase().replaceAll(" ", "")
  );
  let paperClasses = parseStringArraytoEnumArray<PaperClass>(
    getContentsOfType("Paper class", string)
  );
  let kind = parseStringtoEnum<Kind>(
    getContentofType("Kind", string).toUpperCase().replaceAll(" ", "")
  );
  return {
    documentVenue:
      DocumentVenue[documentVenue.toString() as keyof typeof DocumentVenue],
    paperClass: paperClasses.map(
      (elem) => PaperClass[elem.toString() as keyof typeof PaperClass]
    ),
    researchLevel:
      ResearchLevel[researchLevel.toString() as keyof typeof ResearchLevel],
    kind: Kind[kind.toString() as keyof typeof Kind],
  };
}

/**
 * parses the content part of bibtex
 * @param string the description from bibtex
 * @returns an array pf parsed research objects
 */
function parseContent(string: string): Content {
  return {
    researchObjects: parseResearchObjects(string),
  };
}

/**
 * removes curly braces from string
 * @param string content from bibtex with curly braces
 * @returns string without curly braces
 */
function getCurlyBracesContent(string: string): string {
  let result = "";
  let counter = 0;
  let firstIndex = string.indexOf("{");
  for (let i = firstIndex; i < string.length; i++) {
    if (string.charAt(i) === "{") counter++;
    if (string.charAt(i) === "}") counter--;
    if (counter === 0) return string.slice(firstIndex + 1, i);
  }
  return result;
}

/**
 * removes already processed element from remaining list of elements to be processed
 * @param typeOfElement the name of type of the already processed element
 * @param firstElement element already processed
 * @param string string containing all remaining elements to be procesed
 * @returns the remaining list of elements to be processed
 */
function getNextElementsAfter(
  typeOfElement: string,
  firstElement: string,
  string: string
): string {
  let stringToReplace = typeOfElement + "{" + firstElement + "}";
  let endingChar = string.includes(stringToReplace + ", ") ? ", " : "";
  return string.replace(stringToReplace + endingChar, "");
}

/**
 * removes element type and curlybraces from bibtex string
 * @param type the type of element for which content is to be extracted
 * @param string the bibtex string describing the element to be extracted with its type
 * @returns the string describing the element without type or outer curly braces
 */
function getContentofType(type: string, string: string) {
  return string.includes(type + "{")
    ? getCurlyBracesContent(string.slice(string.indexOf(type), string.length))
    : "";
}

/**
 * turns a string describing elements into an array of strings for each element
 * @param type type of the elememts that are described
 * @param string the bibtex string describing the list of elements
 * @returns an array with separated string describing each element separately
 */
// converts strings with multiple entries into a string array
function getContentsOfType(type: string, string: string) {
  return string.includes(type + "{")
    ? getCurlyBracesContent(string.slice(string.indexOf(type), string.length))
        .toUpperCase()
        .replaceAll(" ", "")
        .split(",")
    : [];
}

/**
 * parses validity describing string into a validity object
 * @param string the bibtex string describing validity
 * @returns a validity object corresponding to the input string
 */
function parseValidity(string: string): Validity {
  let toolSupport = parseStringtoEnum<State>(
    getContentofType("Tool Support", string).toUpperCase().replaceAll(" ", "")
  );
  let inputData = parseStringtoEnum<State>(
    getContentofType("Input Data", string).toUpperCase().replaceAll(" ", "")
  );
  let threatstoValidity = parseStringArraytoEnumArray<ThreatstoValidity>(
    getContentsOfType(
      "Threats To Validity",
      string.replace("Referenced Threats To Validity", "")
    )
  );
  return {
    toolSupport: State[toolSupport.toString() as keyof typeof State],
    inputData: State[inputData.toString() as keyof typeof State],
    replicationpackage: string.includes("Replication Package"),
    threatstoValidity: threatstoValidity.map(
      (elem) =>
        ThreatstoValidity[elem.toString() as keyof typeof ThreatstoValidity]
    ),
    referencedThreatsToValidityGuideline: string.includes(
      "Referenced Threats To Validity Guideline"
    ),
  };
}

/**
 * parses research object describing string into a research object array
 * @param string the bibtex string describing research objects
 * @returnsa research object array corresponding to the input string
 */
function parseResearchObjects(string: string): ResearchObject[] {
  let researchObjects = new Array<ResearchObject>();
  let currentObjectDescription = string.includes("Research Object")
    ? getCurlyBracesContent(
        string.slice(string.indexOf("Research Object"), string.lastIndexOf("}"))
      )
    : "";
  let nextElements = string;
  let previousObjectDescription = "";

  while (currentObjectDescription.trim().length != 0) {
    if (currentObjectDescription == previousObjectDescription) {
      console.error(
        "error parsing object description ",
        currentObjectDescription,
        "infinite loop may occur."
      );
      break;
    }
    let researchObject = parseResearchObject(currentObjectDescription);
    researchObjects.push(researchObject);
    let typeOfElement =
      nextElements.slice(
        nextElements.indexOf("{") + 1,
        nextElements.indexOf("Research Object")
      ) + "Research Object";
    nextElements = getNextElementsAfter(
      typeOfElement,
      currentObjectDescription,
      nextElements
    );
    previousObjectDescription = currentObjectDescription.substring(0);
    // doubled to get inside a single research object an iterate over its elements
    currentObjectDescription = getCurlyBracesContent(
      getCurlyBracesContent(nextElements)
    );
  }
  return researchObjects;
}

/**
 * parses research object describing string into a research object
 * @param string the bibtex string describing research object
 * @returns a research object corresponding to the input string
 */
function parseResearchObject(string: string): ResearchObject {
  let researchObjectType = parseStringtoEnum<ResearchObjectType>(
    getContentofType("Research Object", string)
      .toUpperCase()
      .replaceAll(" ", "")
  );
  researchObjectType =
    ResearchObjectType[
      researchObjectType.toString() as keyof typeof ResearchObjectType
    ];
  return {
    researchObject: researchObjectType,
    evaluations: parseEvaluations(
      getNextElementsAfter("Research Object", researchObjectType, string)
    ),
  };
}
/**
 * parses evaluation describing string into an evaluation array
 * @param string the bibtex string describing evaluations
 * @returnsa evaluation array corresponding to the input string
 */
function parseEvaluations(string: string): Evaluation[] {
  let evaluations = new Array<Evaluation>();
  let currentEvaluationDescription = string.includes("Evaluation")
    ? getCurlyBracesContent(
        string.slice(string.indexOf("Evaluation"), string.length)
      )
    : "";
  let nextElements = string;
  let previousEvaluationDescription = "";

  while (currentEvaluationDescription.length != 0) {
    if (currentEvaluationDescription == previousEvaluationDescription) {
      console.error(
        "error parsing evaluation description ",
        currentEvaluationDescription,
        "infinite loop may occur."
      );
      break;
    }
    let evaluation = parseEvaluation(currentEvaluationDescription);
    evaluations.push(evaluation);
    let typeOfElement =
      nextElements.slice(0, nextElements.indexOf("Evaluation")) + "Evaluation";
    nextElements = getNextElementsAfter(
      typeOfElement,
      currentEvaluationDescription,
      nextElements
    );
    previousEvaluationDescription = currentEvaluationDescription.substring(0);
    // doubled call similar to the case of research objects above
    currentEvaluationDescription = getCurlyBracesContent(nextElements);
  }
  return evaluations;
}

/**
 * parses evaluation describing string into an evaluation object
 * @param string the bibtex string describing evaluation
 * @returns an evaluation corresponding to the input string
 */
function parseEvaluation(string: string): Evaluation {
  let evaluationMethods = parseStringArraytoEnumArray<EvaluationMethod>(
    getContentsOfType("Evaluation Method", string)
  );
  let qualityInUse = parseStringArraytoEnumArray<QualityInUse>(
    getContentsOfType("Quality in Use", string)
  );
  let productQuality = parseStringArraytoEnumArray<ProductQuality>(
    getContentsOfType("Product Quality", string)
  );
  let qualityOfAnalyticalMethods =
    parseStringArraytoEnumArray<QualityOfAnalyticalMethods>(
      getContentsOfType("Quality of Method", string)
    );
  return {
    evaluationMethods: evaluationMethods.map(
      (elem) =>
        EvaluationMethod[elem.toString() as keyof typeof EvaluationMethod]
    ),
    properties: {
      qualityInUse: qualityInUse.map(
        (elem) => QualityInUse[elem.toString() as keyof typeof QualityInUse]
      ),
      productQuality: productQuality.map(
        (elem) => ProductQuality[elem.toString() as keyof typeof ProductQuality]
      ),

      qualityOfAnalyticalMethods: qualityOfAnalyticalMethods.map(
        (elem) =>
          QualityOfAnalyticalMethods[
            elem.toString() as keyof typeof QualityOfAnalyticalMethods
          ]
      ),
    },

    referencedEvaluationGuideline: string.includes(
      "Referenced Evaluation Guideline"
    ),
  };
}
function parseStringArraytoEnumArray<T extends Enums>(input: string[]) {
  let result: T[] = [];
  if (input) {
    result = input.map((elem) => {
      let resultingElem = elem as T;
      if (!resultingElem)
        console.error("error, element " + input + " is not supported ");
      return resultingElem;
    });
  }

  return result;
}

function parseStringtoEnum<T extends Enums>(input: string) {
  let result: T = "" as T;
  if (input) {
    result = input.toUpperCase().replaceAll(" ", "") as T;
    if (!result)
      console.error("error, element " + input + " is not supported ");
  }

  return result;
}
