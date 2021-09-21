import * as pdfJS from "pdfjs-dist/build/pdf";
import PDFJSWorker from "pdfjs-dist/build/pdf.worker";

pdfJS.GlobalWorkerOptions.workerPort = new PDFJSWorker();

export default pdfJS;
