import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/utils/groupJoinRequestError.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const code = outputText.replace(
  '"axios"',
  JSON.stringify(import.meta.resolve("axios"))
);
const { getGroupJoinRequestErrorMessage, GROUP_JOIN_REQUEST_PENDING_MESSAGE } =
  await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );

const responseError = (status, data) => ({
  isAxiosError: true,
  response: { status, data },
});

test("duplicate group join responses share the pending-request toast", () => {
  for (const body of [
    { resultCode: "400", message: "400-4 - 이미 가입 승인 대기 중입니다." },
    { resultCode: "400-4" },
  ]) {
    assert.equal(
      getGroupJoinRequestErrorMessage(responseError(400, body)),
      GROUP_JOIN_REQUEST_PENDING_MESSAGE
    );
  }
});

test("other request failures keep the general join-error toast", () => {
  for (const error of [
    responseError(400, {
      resultCode: "400",
      message: "400-3 - 이미 그룹 멤버입니다.",
    }),
    responseError(500, { resultCode: "400-4" }),
    new Error("network error"),
  ]) {
    assert.equal(
      getGroupJoinRequestErrorMessage(error),
      "그룹 가입 요청에 실패했습니다."
    );
  }
});
