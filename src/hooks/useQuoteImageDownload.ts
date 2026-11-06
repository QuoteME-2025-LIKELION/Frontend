import { useCallback } from "react";

import { createQuoteShareImage, type QuoteShareData } from "@/utils/quoteShareImage";

export function useQuoteImageDownload() {
  return useCallback(async (data: QuoteShareData, filename: string) => {
    const blob = await createQuoteShareImage(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    try {
      document.body.appendChild(link);
      link.click();
    } finally {
      link.remove();
      // 브라우저가 파일을 읽기 전에 object URL을 해제하지 않는다.
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  }, []);
}
