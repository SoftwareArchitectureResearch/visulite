export interface Validity {
  toolSupport: State;
  inputData: State;
  replicationpackage: boolean;
  threatstoValidity: ThreatstoValidity[];
  referencedThreatsToValidityGuideline: boolean;
}

export enum ThreatstoValidity {
  EXTERNALVALIDITY = "External Validity",
  INTERNALVALIDITY = "Internal Validity",
  CONSTRUCTVALIDITY = "Construct Validity",
  CONFIRMABILITY = "Confirmability",
  REPEATABILITY = "Repeatability",
}

export enum State {
  NONE = "none",
  USED = "used",
  AVAILABLE = "available",
}
