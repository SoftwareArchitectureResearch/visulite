import { readFile } from "./fileReader";
jest.mock(
  "../../src/services/ECSA-ICSA-Proceedings.bib",
  () =>
    `@InProceedings{testCiteKey,
    author = {H{\'{e}}ctor Cadavid},
    booktitle = {Test Book Title},
    title = {Test Title},
    year = {2023},
    pages = {1-1},
    publisher = {{IEEE}},
    bibsource = {test bibliography},
    biburl = {https://testurl.bib},
    creationdate = {2023-08-28T16:10:00},
    doi = {00.0000/TDOI00000.2023.00000},
    file = {TestFile.pdf:PDF},
    url = {https://test doi url},
    classes = {Meta Data{Research Level{Primary Research}, Kind{full}, Paper class{Proposal of Solution}}, First Research Object{Research Object{Architecture Design Method}, First Evaluation{Evaluation Method{Interview}, Properties{Product Quality{Functional Suitability}}, Referenced Evaluation Guideline}}}
}`
);

test("reads file successfuly", () => {
  let result = readFile();
  expect(result).toBe(
    "@InProceedings{testCiteKey,\n" +
      "    author = {Héctor Cadavid},\n" +
      "    booktitle = {Test Book Title},\n" +
      "    title = {Test Title},\n" +
      "    year = {2023},\n" +
      "    pages = {1-1},\n" +
      "    publisher = {{IEEE}},\n" +
      "    bibsource = {test bibliography},\n" +
      "    biburl = {https://testurl.bib},\n" +
      "    creationdate = {2023-08-28T16:10:00},\n" +
      "    doi = {00.0000/TDOI00000.2023.00000},\n" +
      "    file = {TestFile.pdf:PDF},\n" +
      "    url = {https://test doi url},\n" +
      "    classes = {Meta Data{Research Level{Primary Research}, Kind{full}, Paper class{Proposal of Solution}}, First Research Object{Research Object{Architecture Design Method}, First Evaluation{Evaluation Method{Interview}, Properties{Product Quality{Functional Suitability}}, Referenced Evaluation Guideline}}}\n" +
      "}"
  );
});
