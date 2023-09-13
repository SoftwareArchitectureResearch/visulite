import { BibWrapper } from "../domain/model/BibWrapper";
import { Entry } from "bibtex-js-parser";
import { LiteratureClass } from "../domain/model/classes/LiteratureClass";
import { Metadata } from "../domain/model/classes/Metadata";
import { Validity } from "../domain/model/classes/Validity";
import { Content } from "../domain/model/classes/Content";
import { ResearchObject } from "../domain/model/classes/ResearchObject";
import { Evaluation } from "../domain/model/classes/Evaluation";
import { ColumnIdLabelArray } from "../mui/Tables/Table";
import { getElementIndexById } from "../mui/Tables/TableUtils";

const ResearchObjectsInitial = "RO";
const EvaluationsInitial = "E";

/**
 * This class is helper to transform a BibWrapper object into a MUI row
 * to be added to the Table component
 */
export class TableRowCalculator {
  row: string[] = [];
  TableRowCalculator() {
    this.row.length = ColumnIdLabelArray.length + 1;
  }

  /**
   * creates a row based on its index and the corresponding BibWrapper object
   * @param input the BibWrapper object to be transformed into a table row
   * @param index the index of the row in the table
   * @returns the row representing the input
   */
  calculateTableRows(input: BibWrapper, index: number) {
    this.row = [];
    this.row.length = ColumnIdLabelArray.length;
    this.addBibEntry(input.bibEntry);
    this.addLiteratureClasses(input.literatureClasses);
    return {
      id: index,
      citekey: this.row[getElementIndexById("citekey", ColumnIdLabelArray)],
      title: this.row[getElementIndexById("title", ColumnIdLabelArray)],
      author: this.row[getElementIndexById("author", ColumnIdLabelArray)],
      documentVenue:
        this.row[getElementIndexById("documentVenue", ColumnIdLabelArray)],
      paperClasses:
        this.row[
          getElementIndexById("paperClasses", ColumnIdLabelArray)
        ]?.split(","),
      researchLevel:
        this.row[getElementIndexById("researchLevel", ColumnIdLabelArray)],
      kind: this.row[getElementIndexById("kind", ColumnIdLabelArray)],
      toolSupport:
        this.row[getElementIndexById("toolSupport", ColumnIdLabelArray)],
      inputData: this.row[getElementIndexById("inputData", ColumnIdLabelArray)],
      replicationPackage:
        this.row[getElementIndexById("replicationPackage", ColumnIdLabelArray)],
      threatsToValidity:
        this.row[
          getElementIndexById("threatsToValidity", ColumnIdLabelArray)
        ]?.split(","),
      referencedThreatsToValidityGuideline:
        this.row[
          getElementIndexById(
            "referencedThreatsToValidityGuideline",
            ColumnIdLabelArray
          )
        ],
      researchObjects:
        this.row[
          getElementIndexById("researchObjects", ColumnIdLabelArray)
        ]?.split(","),
      evaluationMethods:
        this.row[
          getElementIndexById("evaluationMethods", ColumnIdLabelArray)
        ]?.split(","),
      qualityInUse:
        this.row[
          getElementIndexById("qualityInUse", ColumnIdLabelArray)
        ]?.split(","),
      productQuality:
        this.row[
          getElementIndexById("productQuality", ColumnIdLabelArray)
        ]?.split(","),
      qualityOfAnalyticalMethod:
        this.row[
          getElementIndexById("qualityOfAnalyticalMethod", ColumnIdLabelArray)
        ]?.split(","),
      referencedEvaluationGuideline:
        this.row[
          getElementIndexById(
            "referencedEvaluationGuideline",
            ColumnIdLabelArray
          )
        ]?.split(","),
    };
  }

  private addBibEntry(entry: Entry) {
    this.row[getElementIndexById("citekey", ColumnIdLabelArray)] = entry.id;
    this.row[getElementIndexById("title", ColumnIdLabelArray)] = entry.title;
    this.row[getElementIndexById("author", ColumnIdLabelArray)] = entry.author
      ? entry.author
      : "";
  }
  private addLiteratureClasses(classes: LiteratureClass) {
    this.addMetadata(classes.metadata);
    this.addValidity(classes.validity);
    this.addContent(classes.content);
  }

  private addMetadata(metadata: Metadata) {
    this.row[getElementIndexById("documentVenue", ColumnIdLabelArray)] =
      metadata.documentVenue;
    let paperClassIndex = getElementIndexById(
      "paperClasses",
      ColumnIdLabelArray
    );
    metadata.paperClass.map((elem) => {
      if (elem) {
        this.row[paperClassIndex]
          ? (this.row[paperClassIndex] += ",")
          : (this.row[paperClassIndex] = "");
        this.row[paperClassIndex] += elem;
      }
    });
    this.row[getElementIndexById("researchLevel", ColumnIdLabelArray)] =
      metadata.researchLevel;
    this.row[getElementIndexById("kind", ColumnIdLabelArray)] = metadata.kind;
  }

  private addValidity(validity: Validity) {
    this.row[getElementIndexById("toolSupport", ColumnIdLabelArray)] =
      validity.toolSupport;
    this.row[getElementIndexById("inputData", ColumnIdLabelArray)] =
      validity.inputData;
    this.row[getElementIndexById("replicationPackage", ColumnIdLabelArray)] =
      validity.replicationpackage.toString();
    validity.threatstoValidity.map((elem) => {
      let threatsToValidityIndex = getElementIndexById(
        "threatsToValidity",
        ColumnIdLabelArray
      );
      if (elem) {
        this.row[threatsToValidityIndex]
          ? (this.row[threatsToValidityIndex] += ",")
          : (this.row[threatsToValidityIndex] = "");
        this.row[threatsToValidityIndex] += elem;
      }
    });
    this.row[
      getElementIndexById(
        "referencedThreatsToValidityGuideline",
        ColumnIdLabelArray
      )
    ] = validity.referencedThreatsToValidityGuideline?.toString();
  }

  private addContent(content: Content) {
    content.researchObjects.map((researchObject, rOIndex) => {
      this.addResearchObject(researchObject, rOIndex);
    });
  }

  private addResearchObject(researchObject: ResearchObject, rOIndex: number) {
    this.row[getElementIndexById("researchObjects", ColumnIdLabelArray)] =
      researchObject.researchObject;
    researchObject.evaluations.map((evaluation, eIndex) => {
      this.addEvaluation(evaluation, rOIndex + 1, eIndex + 1);
    });
  }

  private addEvaluation(
    evaluation: Evaluation,
    researchObjectNumber: number,
    evaluationNumber: number
  ) {
    let evaluationMethodIndex = getElementIndexById(
      "evaluationMethods",
      ColumnIdLabelArray
    );
    evaluation.evaluationMethods.map((method) => {
      if (method) {
        this.row[evaluationMethodIndex]
          ? (this.row[evaluationMethodIndex] += ",")
          : (this.row[evaluationMethodIndex] = "");

        this.row[evaluationMethodIndex] = this.addElement(
          this.row[evaluationMethodIndex],
          method,
          researchObjectNumber,
          evaluationNumber
        );
      }
    });
    let qualityInUseIndex = getElementIndexById(
      "qualityInUse",
      ColumnIdLabelArray
    );
    evaluation.properties.qualityInUse.map((elem) => {
      if (elem) {
        this.row[qualityInUseIndex]
          ? (this.row[qualityInUseIndex] += ",")
          : (this.row[qualityInUseIndex] = "");
        this.row[qualityInUseIndex] = this.addElement(
          this.row[qualityInUseIndex],
          elem,
          researchObjectNumber,
          evaluationNumber
        );
      }
    });
    let productQualityIndex = getElementIndexById(
      "productQuality",
      ColumnIdLabelArray
    );
    evaluation.properties.productQuality.map((elem) => {
      if (elem) {
        this.row[productQualityIndex]
          ? (this.row[productQualityIndex] += ",")
          : (this.row[productQualityIndex] = "");
        this.row[productQualityIndex] = this.addElement(
          this.row[productQualityIndex],
          elem,
          researchObjectNumber,
          evaluationNumber
        );
      }
    });
    let qualityOfAnalyticalMethodIndex = getElementIndexById(
      "qualityOfAnalyticalMethod",
      ColumnIdLabelArray
    );
    evaluation.properties.qualityOfAnalyticalMethods.map((elem) => {
      if (elem) {
        this.row[qualityOfAnalyticalMethodIndex]
          ? (this.row[qualityOfAnalyticalMethodIndex] += ",")
          : (this.row[qualityOfAnalyticalMethodIndex] = "");
        this.row[qualityOfAnalyticalMethodIndex] = this.addElement(
          this.row[qualityOfAnalyticalMethodIndex],
          elem,
          researchObjectNumber,
          evaluationNumber
        );
      }
    });
    this.row[
      getElementIndexById("referencedEvaluationGuideline", ColumnIdLabelArray)
    ] =
      evaluation.referencedEvaluationGuideline.toString() +
      " (" +
      researchObjectNumber +
      "-" +
      evaluationNumber +
      ")";
  }

  private createReference(rOIndex: number, evalIndex: number) {
    return (
      " (" +
      ResearchObjectsInitial +
      " " +
      rOIndex +
      " - " +
      EvaluationsInitial +
      " " +
      evalIndex +
      ")"
    );
  }

  private addElement(
    dest: string,
    src: string,
    researchObjectNumber: number,
    evaluationNumber: number
  ) {
    let destArray = dest.split(",");
    // check whether same elem
    destArray = dest.split(",");

    destArray = destArray.filter(
      (elem) => elem.indexOf(src) >= 0 && elem !== ""
    );
    if (destArray != null && destArray[0]) {
      let result = destArray[0].slice(0, destArray[0].length - 1);
      //same research object found
      if (
        result.indexOf(ResearchObjectsInitial + " " + researchObjectNumber) > 0
      ) {
        let posSlash =
          result.indexOf("/") >= 0 ? result.indexOf("/") : result.length;
        let posHyphen =
          result.indexOf("E -") >= 0 ? result.indexOf("E -") : result.length;

        let stringToReplace = result.slice(
          0,
          Math.min(posSlash, posHyphen) - 1
        );
        let newString = stringToReplace + evaluationNumber + " & ";
        result =
          result.replace(stringToReplace, newString) +
          destArray[0].charAt(destArray[0].length - 1);
        dest = dest.replace(destArray[0], result);
        return dest.slice(0, dest.length - 1);
      }

      // same elem but different research objects
      result =
        result +
        "/" +
        ResearchObjectsInitial +
        " " +
        researchObjectNumber +
        " - " +
        +EvaluationsInitial +
        " " +
        evaluationNumber +
        ")";
      dest = dest.replace(destArray[0], result);
      return dest.slice(0, dest.length - 1);
    }

    // elem does not exist yet
    dest =
      dest + src + this.createReference(researchObjectNumber, evaluationNumber);
    return dest;
  }
}
