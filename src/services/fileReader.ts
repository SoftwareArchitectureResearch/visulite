import bibFile from "../services/ECSA-ICSA-Proceedings.bib";

/**
 * reads the content of the input file from a bibtex to a string
 * @returns the content of the input file with adequte formatting
 */
export function readFile(): string {
  return convertLatexToUnicode(
    bibFile
      .replace(/\t/g, "    ")
      .replace(/\r/g, "")
      .replace(/\\/g, "")
      .replace(/}\n}\n\n/g, "}\n  }\n  \n  ")
  );
}

function convertLatexToUnicode(latexString: string) {
  const accentMap: StringMap = {
    "`": "\u0300",
    "'": "\u0301",
    "^": "\u0302",
    "~": "\u0303",
    '"': "\u0308",
  };
  const vowelMap: StringMap = {
    a: "a",
    e: "e",
    i: "i",
    o: "o",
    u: "u",
  };
  const unicodeString = latexString.replace(
    /{([`''^~"]){([aeiouAEIOU])}}/g,
    (match, accent, vowel) => {
      const unicodeAccent = accentMap[accent];
      const unicodeVowel = vowelMap[vowel.toLowerCase()];
      return unicodeVowel + unicodeAccent;
    }
  );

  return unicodeString;
}

interface StringMap {
  [key: string]: string;
}
