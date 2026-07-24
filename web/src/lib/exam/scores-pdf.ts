import path from "path";
import fs from "fs";
import { createRequire } from "module";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { Exam } from "./types";
import {
  formatGradeOutOf20,
  formatPersianDateTime,
  getExamTypeLabel,
  getGradingStatusLabel,
  isTestExam,
  type RankingEntry,
} from "./types";

const require = createRequire(path.join(process.cwd(), "package.json"));
const pdfmake = require("pdfmake") as {
  setFonts: (fonts: Record<string, { normal: string; bold: string; italics: string; bolditalics: string }>) => void;
  setLocalAccessPolicy: (callback: (filePath: string) => boolean) => void;
  createPdf: (docDefinition: TDocumentDefinitions) => { getBuffer: () => Promise<Buffer> };
};

type ScoreColumn = {
  header: string;
  width: number;
  value: (row: RankingEntry) => string;
};

let fontsConfigured = false;

function getFontPath(): string {
  const pkgPath = require.resolve("vazirmatn/package.json");
  const fontPath = path.join(path.dirname(pkgPath), "fonts", "ttf", "Vazirmatn-Regular.ttf");
  if (!fs.existsSync(fontPath)) {
    throw new Error("فونت PDF یافت نشد");
  }
  return fontPath;
}

function ensurePdfFonts() {
  if (fontsConfigured) return;
  const fontPath = getFontPath();
  pdfmake.setFonts({
    Vazirmatn: {
      normal: fontPath,
      bold: fontPath,
      italics: fontPath,
      bolditalics: fontPath,
    },
  });
  pdfmake.setLocalAccessPolicy(() => true);
  fontsConfigured = true;
}

function buildColumns(exam: Exam): ScoreColumn[] {
  if (isTestExam(exam.exam_type)) {
    return [
      { header: "رتبه", width: 42, value: (row) => String(row.rank) },
      { header: "نام", width: 95, value: (row) => row.first_name },
      { header: "نام خانوادگی", width: 110, value: (row) => row.last_name },
      { header: "درصد", width: 55, value: (row) => `${row.percentage}%` },
      {
        header: "پاسخ صحیح",
        width: 70,
        value: (row) => `${row.correct_count}/${row.total_questions}`,
      },
      {
        header: "زمان ثبت",
        width: 103,
        value: (row) => formatPersianDateTime(row.finished_at),
      },
    ];
  }

  return [
    {
      header: "رتبه",
      width: 42,
      value: (row) => (row.rank > 0 ? String(row.rank) : "—"),
    },
    { header: "نام", width: 85, value: (row) => row.first_name },
    { header: "نام خانوادگی", width: 100, value: (row) => row.last_name },
    {
      header: "وضعیت",
      width: 75,
      value: (row) => getGradingStatusLabel(row.grading_status ?? "pending"),
    },
    {
      header: "نمره از ۲۰",
      width: 70,
      value: (row) =>
        row.grading_status === "graded"
          ? formatGradeOutOf20(row.correct_count, row.total_questions)
          : "—",
    },
    {
      header: "درصد",
      width: 50,
      value: (row) => (row.grading_status === "graded" ? `${row.percentage}%` : "—"),
    },
    {
      header: "زمان ثبت",
      width: 98,
      value: (row) => formatPersianDateTime(row.finished_at),
    },
  ];
}

function buildScoresTable(exam: Exam, rankings: RankingEntry[]): Content {
  const columns = buildColumns(exam);
  const widths = columns.map((column) => column.width).reverse();
  const headerRow = columns
    .map((column) => ({ text: column.header, style: "tableHeader" }))
    .reverse();
  const dataRows = rankings.map((row) =>
    columns.map((column) => column.value(row)).reverse()
  );

  return {
    table: {
      headerRows: 1,
      widths,
      body: [headerRow, ...dataRows],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0,
      hLineColor: () => "#d1fae5",
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 5,
      paddingBottom: () => 5,
      fillColor: (rowIndex: number) => (rowIndex === 0 ? "#ecfdf5" : null),
    },
  };
}

function buildDocumentDefinition(exam: Exam, rankings: RankingEntry[]): TDocumentDefinitions {
  return {
    pageSize: "A4",
    pageMargins: [40, 48, 40, 48],
    defaultStyle: {
      font: "Vazirmatn",
      fontSize: 10,
      alignment: "right",
      color: "#0f172a",
    },
    content: [
      { text: "Pepsino LAB", style: "brand" },
      { text: "گزارش نمرات آزمون", style: "title" },
      { text: `عنوان: ${exam.title}`, style: "meta" },
      { text: `نوع آزمون: ${getExamTypeLabel(exam.exam_type)}`, style: "meta" },
      { text: `تعداد سوال: ${exam.question_count}`, style: "meta" },
      {
        text: `تاریخ تهیه گزارش: ${formatPersianDateTime(new Date().toISOString())}`,
        style: "meta",
      },
      { text: `تعداد شرکت‌کننده: ${rankings.length}`, style: "meta", margin: [0, 0, 0, 14] },
      buildScoresTable(exam, rankings),
    ],
    styles: {
      brand: {
        fontSize: 11,
        color: "#15803d",
        margin: [0, 0, 0, 4],
      },
      title: {
        fontSize: 18,
        bold: true,
        color: "#14532d",
        margin: [0, 0, 0, 12],
      },
      meta: {
        fontSize: 10,
        color: "#475569",
        margin: [0, 0, 0, 4],
      },
      tableHeader: {
        bold: true,
        color: "#166534",
        fontSize: 10,
      },
    },
    info: {
      title: `نمرات ${exam.title}`,
      author: "Pepsino LAB",
    },
  };
}

export async function generateScoresPdf(exam: Exam, rankings: RankingEntry[]): Promise<Buffer> {
  ensurePdfFonts();
  const pdfDoc = pdfmake.createPdf(buildDocumentDefinition(exam, rankings));
  return pdfDoc.getBuffer();
}

export function buildScoresPdfFilename(examTitle: string, examId?: number): string {
  const asciiTitle = examTitle
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  if (asciiTitle) {
    return `scores-${asciiTitle}.pdf`;
  }

  return `scores-exam-${examId ?? "export"}.pdf`;
}

export function buildScoresPdfFilenameUtf8(examTitle: string, examId?: number): string {
  const safeTitle = examTitle
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

  return `scores-${safeTitle || `exam-${examId ?? "export"}`}.pdf`;
}
