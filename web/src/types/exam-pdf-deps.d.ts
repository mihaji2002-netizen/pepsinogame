declare module "arabic-persian-reshaper" {
  const reshaper: {
    PersianShaper: {
      convertArabic: (text: string) => string;
    };
    ArabicShaper: {
      convertArabic: (text: string) => string;
    };
  };

  export = reshaper;
}

declare module "bidi-js" {
  interface EmbeddingLevelsResult {
    levels: Uint8Array;
    paragraphs: Array<{ start: number; end: number; level: number }>;
  }

  interface Bidi {
    getEmbeddingLevels: (text: string, direction?: "ltr" | "rtl") => EmbeddingLevelsResult;
    getReorderedString: (
      text: string,
      embeddingLevels: EmbeddingLevelsResult,
      start?: number,
      end?: number
    ) => string;
  }

  export default function bidiFactory(): Bidi;
}
