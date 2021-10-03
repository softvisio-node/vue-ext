import * as pdfJs from "pdfjs-dist/build/pdf";
import PdfJsWorker from "pdfjs-dist/build/pdf.worker";

pdfJs.GlobalWorkerOptions.workerPort = new PdfJsWorker();

export default pdfJs;
