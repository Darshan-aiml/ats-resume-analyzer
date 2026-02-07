import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const readAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });

const readAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });

const cleanText = (text) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, " ")
    .trim();

const extractFromPdf = async (file) => {
  const buffer = await readAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    pages.push(strings.join(" "));
  }

  return cleanText(pages.join(" "));
};

export async function parseResumeFile(file) {
  if (!file) return "";

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    return extractFromPdf(file);
  }

  if (extension === "txt") {
    return cleanText(await readAsText(file));
  }

  throw new Error("Only PDF or TXT resumes are supported for transparent parsing.");
}
