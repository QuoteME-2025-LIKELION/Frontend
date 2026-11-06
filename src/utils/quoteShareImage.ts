export interface QuoteShareData {
  date: string;
  content: string;
  authorName: string;
  authorBirthYear?: string | number | null;
  taggedNames?: string[];
}

export const SHARE_IMAGE_SIZE = { width: 1080, height: 1350 } as const;

/** 날짜만 있는 문자열은 브라우저 시간대에 따라 전날로 바뀌지 않게 해석한다. */
export function getShareDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T| )/.exec(date);
  if (!match) throw new Error("명언 작성일을 확인할 수 없습니다.");
  const [, year, month, day] = match;
  const value = new Date(Number(year), Number(month) - 1, Number(day));
  if (value.getFullYear() !== Number(year) || value.getMonth() !== Number(month) - 1 || value.getDate() !== Number(day)) {
    throw new Error("명언 작성일이 올바르지 않습니다.");
  }
  return {
    month: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][value.getMonth()],
    day: String(value.getDate()),
    weekday: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][value.getDay()],
  };
}

export function getShareAuthor(name: string, birthYear: QuoteShareData["authorBirthYear"]) {
  const year = String(birthYear ?? "");
  return /^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= new Date().getFullYear()
    ? `${name} (${year}~)` : name;
}

/** 단어 경계를 우선하며 긴 단어/이모지는 코드포인트 경계로 줄바꿈한다. */
export function wrapShareText(text: string, maxWidth: number, measure: (text: string) => number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let remaining = Array.from(paragraph.trim());
    if (remaining.length === 0) lines.push("");
    while (remaining.length) {
      let count = 0;
      while (count < remaining.length && measure(remaining.slice(0, count + 1).join("")) <= maxWidth) count++;
      count = Math.max(1, count);
      if (count < remaining.length) {
        const space = remaining.slice(0, count + 1).lastIndexOf(" ");
        if (space > 0) count = space;
      }
      lines.push(remaining.slice(0, count).join("").trimEnd());
      remaining = remaining.slice(count);
      while (remaining[0] === " ") remaining.shift();
    }
  }
  return lines;
}

function loadBackground() {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("공유 이미지 배경을 불러오지 못했습니다."));
    image.src = "/images/share/quote-background.png";
  });
}

/** 사용자 제공 배경 위에 실제 명언 데이터만 그린다. 화면 버튼/원문 일기는 포함하지 않는다. */
export async function createQuoteShareImage(data: QuoteShareData): Promise<Blob> {
  if (!data.content.trim()) throw new Error("공유할 명언이 없습니다.");
  const date = getShareDate(data.date);
  const [background] = await Promise.all([
    loadBackground(),
    document.fonts.load('400 160px "HSBombaram"', `${date.month} ${date.day}`),
    document.fonts.load('500 92px "KoPubWorldBatang"', data.content),
    document.fonts.load('300 80px "KoPubWorldBatang"', `${data.authorName} ${data.taggedNames?.join(" ") ?? ""} oct 화요일 31 QuoteMe “`),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_IMAGE_SIZE.width;
  canvas.height = SHARE_IMAGE_SIZE.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("공유 이미지를 생성할 수 없습니다.");
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.textBaseline = "top";
  ctx.fillStyle = "#fafafa";
  ctx.textAlign = "center";
  ctx.font = '500 80px "HSBombaram"';
  ctx.fillText(date.month, 540, 100);
  ctx.fillStyle = "#aec2d4";
  ctx.font = '300 34px "KoPubWorldBatang"';
  ctx.fillText(date.weekday, 540, 188);
  ctx.fillStyle = "#fafafa";
  ctx.font = '400 160px "HSBombaram"';
  ctx.fillText(date.day, 540, 240);

  ctx.textAlign = "left";
  const fontSize = 92;
  const lineHeight = fontSize * 1.44;
  ctx.font = `500 ${fontSize}px "KoPubWorldBatang"`;
  const lines = wrapShareText(data.content.trim(), 952, (text) => ctx.measureText(text).width);
  // 마지막 줄의 실제 글자 하단을 구분선에서 64px 위에 고정한다.
  ctx.textBaseline = "alphabetic";
  const descent = ctx.measureText(lines.at(-1) ?? "").actualBoundingBoxDescent || 0;
  const lastBaseline = 993 - 64 - descent;
  const firstBaseline = lastBaseline - (lines.length - 1) * lineHeight;
  if (firstBaseline - fontSize < 430) throw new Error("명언이 너무 길어 공유 이미지에 담을 수 없습니다.");
  lines.forEach((line, index) => ctx.fillText(line, 64, firstBaseline + index * lineHeight));
  ctx.textBaseline = "top";
  ctx.font = '300 140px "KoPubWorldBatang"';
  ctx.fillText("“", 64, Math.min(562, firstBaseline - fontSize - 130));

  ctx.strokeStyle = "#aec2d4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 993);
  ctx.lineTo(1016, 993);
  ctx.stroke();
  ctx.fillStyle = "#aec2d4";
  ctx.font = '300 34px "KoPubWorldBatang"';
  const author = getShareAuthor(data.authorName, data.authorBirthYear);
  const tags = data.taggedNames?.length ? `with ${data.taggedNames.join(", ")}` : "";
  const measure = (text: string) => ctx.measureText(text).width;
  // 양쪽 문구가 긴 경우 태그를 다음 행으로 내려 겹치지 않게 한다.
  const authorLines = wrapShareText(author, 952, measure);
  authorLines.forEach((line, index) => ctx.fillText(line, 64, 1044 + index * 45));
  if (tags) {
    const sameRow = authorLines.length === 1 && measure(author) + measure(tags) + 48 <= 952;
    let tagSize = 34;
    let tagLines: string[];
    const top = sameRow ? 1044 : 1044 + authorLines.length * 45 + 10;
    do {
      ctx.font = `300 ${tagSize}px "KoPubWorldBatang"`;
      tagLines = wrapShareText(tags, 952, (text) => ctx.measureText(text).width);
      if (top + tagLines.length * tagSize * 1.35 <= 1210) break;
      tagSize -= 2;
    } while (tagSize >= 18);
    if (tagSize < 18) throw new Error("태그가 너무 많아 공유 이미지에 담을 수 없습니다.");
    ctx.textAlign = "right";
    tagLines.forEach((line, index) => ctx.fillText(line, 1016, top + index * tagSize * 1.35));
  }
  ctx.fillStyle = "#fafafa";
  ctx.textAlign = "center";
  ctx.font = '300 36px "KoPubWorldBatang"';
  ctx.fillText("QuoteMe", 540, 1258);
  return new Promise((resolve, reject) => canvas.toBlob(
    (blob) => blob ? resolve(blob) : reject(new Error("공유 이미지 저장에 실패했습니다.")), "image/png"
  ));
}
