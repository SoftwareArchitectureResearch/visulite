export interface Metadata {
  documentVenue: DocumentVenue;
  paperClass: PaperClass[];
  researchLevel: ResearchLevel;
  kind: Kind;
}
export enum PaperClass {
  EVALUATIONRESEARCH = "Evaluation Research",
  PROPOSALOFSOLUTION = "Proposal of Solution",
  VALIDATIONRESEARCH = "Validation Research",
  PHILOSOPHICALPAPERS = "Philosophical Papers",
  OPINIONPAPERS = "Opinion Papers",
  PERSONALEXPERIENCEPAPERS = "Personal Experience Papers",
}

export enum DocumentVenue {
  ICSA = "ICSA",
  ECSA = "ECSA",
}

export enum ResearchLevel {
  PRIMARYRESEARCH = "Primary Research",
  SECONDARYRESEARCH = "Secondary Research",
}

export enum Kind {
  FULL = "full",
  TEACHING = "teaching",
}
