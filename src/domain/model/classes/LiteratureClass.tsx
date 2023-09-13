import { Content } from "./Content";
import { Metadata } from "./Metadata";
import { Validity } from "./Validity";

export interface LiteratureClass {
  citekey: string;
  metadata: Metadata;
  validity: Validity;
  content: Content;
}
