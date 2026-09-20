import { toPng } from "html-to-image";
import { useCallback } from "react";

import theme from "@/styles/theme";

type ElementImageDownloadOptions = {
  backgroundColor?: string;
  paddingBottom?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
};

/**
 * DOM 요소를 PNG 이미지로 변환해 다운로드하는 공유용 훅
 */
export function useElementImageDownload() {
  return useCallback(
    async (
      element: HTMLElement | null,
      filename: string,
      options: ElementImageDownloadOptions = {}
    ) => {
      if (!element) {
        throw new Error("다운로드할 요소를 찾을 수 없습니다.");
      }

      const backgroundColor = options.backgroundColor ?? theme.colors.primary;
      const horizontalPadding = options.horizontalPadding ?? 0;
      const paddingTop = options.verticalPadding ?? 0;
      const paddingBottom = options.paddingBottom ?? options.verticalPadding ?? 0;
      const shouldAddPadding =
        horizontalPadding > 0 || paddingTop > 0 || paddingBottom > 0;
      const capturedDataUrl = await toPng(element, { backgroundColor });
      const dataUrl = shouldAddPadding
        ? await addImagePadding(capturedDataUrl, {
            backgroundColor,
            elementWidth: element.getBoundingClientRect().width,
            horizontalPadding,
            paddingBottom,
            paddingTop,
          })
        : capturedDataUrl;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    },
    []
  );
}

async function addImagePadding(
  dataUrl: string,
  {
    backgroundColor,
    elementWidth,
    horizontalPadding,
    paddingBottom,
    paddingTop,
  }: {
    backgroundColor: string;
    elementWidth: number;
    horizontalPadding: number;
    paddingBottom: number;
    paddingTop: number;
  }
) {
  const image = await loadImage(dataUrl);
  const pixelRatio = elementWidth > 0 ? image.width / elementWidth : 1;
  const leftRightPadding = Math.round(horizontalPadding * pixelRatio);
  const topPadding = Math.round(paddingTop * pixelRatio);
  const bottomPadding = Math.round(paddingBottom * pixelRatio);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지를 생성할 수 없습니다.");
  }

  canvas.width = image.width + leftRightPadding * 2;
  canvas.height = image.height + topPadding + bottomPadding;

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, leftRightPadding, topPadding);

  return canvas.toDataURL("image/png");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
