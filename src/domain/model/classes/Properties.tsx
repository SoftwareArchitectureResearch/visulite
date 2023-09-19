export interface Properties {
  qualityInUse: QualityInUse[];
  productQuality: ProductQuality[];
  qualityOfAnalyticalMethods: QualityOfAnalyticalMethods[];
}

export enum QualityInUse {
  EFFECTIVENESS = " Effectiveness",
  SATISFACTION = "Satisfaction",
  FREEDOMFROMRISK = "Freedom from Risk",
  CONTEXTCOVERAGE = "Context coverage",
}

export enum ProductQuality {
  FUNCTIONALSUITABILITY = "Functional Suitability",
  PERFORMANCEEFFICIENCY = "Performance efficiency",
  COMPATIBILITY = "Compatibility",
  USABILITY = "Usability",
  RELIABILITY = "Reliability",
  SECURITY = "Security",
  MAINTAINABILITY = "Maintainability",
  PORTABILITY = "Portability",
}

export enum QualityOfAnalyticalMethods {
  ACCURACY = "Accuracy",
  RECOVERY = "Recovery",
  SPECIFICITY = "Specificity",
  LIMITOFDETECTION = "Limit of detection",
  LIMITOFQUANTITATION = "Limit of quantitation",
  LINEARITY = "Linearity",
  RUGGEDNESS = "Ruggedness",
  ROBUSTNESS = "Robustness",
  SENSITIVITY = "Sensitivity",
}
