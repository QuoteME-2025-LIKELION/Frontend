import { toPng } from "html-to-image";
import { useCallback } from "react";

/**
 * DOM 요소를 PNG 이미지로 변환해 다운로드하는 공유용 훅
 */
export function useElementImageDownload() {
  return useCallback(async (element: HTMLElement | null, filename: string) => {
    if (!element) {
      throw new Error("다운로드할 요소를 찾을 수 없습니다.");
    }

    const dataUrl = await toPng(element);
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);
}
