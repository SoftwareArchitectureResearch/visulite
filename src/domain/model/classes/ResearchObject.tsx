import { Evaluation } from "./Evaluation";

export interface ResearchObject {
  researchObject: ResearchObjectType;
  evaluations: Evaluation[];
}

export enum ResearchObjectType {
  ARCHITECTUREANALYSISMETHOD = "Architecture Analysis Method",
  ARCHITECTUREDESIGNMETHOD = "Architecture Design Method",
  ARCHITECTUREOPTIMIZATIONMETHOD = "Architecture Optimization Method",
  ARCHITECTUREEVOLUTION = "Architecture Evolution",
  ARCHITECTUREDESCRIPTIONLANGUAGE = "Architecture Description Language",
  ARCHITECTUREDECISIONMAKING = "Architecture Decision Making",
  REFERENCEARCHITECTURE = "Reference Architecture",
  ARCHITECTUREPATTERN = "Architecture Pattern",
  ARCHITECTUREDESCRIPTION = "Architecture Description",
  ARCHITECTURALASPECTS = "Architectural Aspects",
  TECHNICALDEBT = "Technical Debt",
  ARCHITECTUREEXTRACTION = "Architecture Extraction",
  ARCHITECTUREASSUMPTIONS = "Architectural Assumptions",
}
