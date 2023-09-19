import { Properties } from "./Properties";

export interface Evaluation {
  evaluationMethods: EvaluationMethod[];
  properties: Properties;
  referencedEvaluationGuideline: boolean;
}

export enum EvaluationMethod {
  CASESTUDY = "Case Study",
  TECHNICALEXPERIMENT = "Technical Experiment",
  MOTIVATINGEXAMPLE = "Motivating Example",
  QUESTIONNAIRE = "Questionnaire",
  INTERVIEW = "Interview",
  BENCHMARK = "Benchmark",
  GROUNDEDTHEORY = "Grounded Theory",
  FIELDEXPERIMENT = "Field Experiment",
  ARGUMENTATION = "Argumentation",
  FOCUSGROUP = "Focus Group",
  DATASCIENCE = "Data Science",
  CONTROLLEDEXPERIMENT = "Controlled Experiment",
  VERIFICATION = "Verification",
}
