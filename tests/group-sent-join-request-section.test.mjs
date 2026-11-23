import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const moduleUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const react = moduleUrl(`
  export const useId = () => "group-requests";
  export const useState = (initial) => [
    globalThis.__groupSentSelected ?? initial,
    (value) => { globalThis.__groupSentSelected = value; },
  ];
`);
const styles = moduleUrl(`
  export const Section = "section", RequestTabs = "nav", RequestTab = "button",
    FriendList = "div", RequestItem = "article", SentRequestItem = "article",
    RequestDefaultProfileImg = "span", RequestUserBox = "div",
    RequestUsername = "strong", RequestIntro = "p",
    RequestCancelActionBox = "aside", RequestActionBox = "aside";
`);
const source = await readFile(
  new URL(
    "../src/pages/FriendGroup/components/GroupInvitationSection.tsx",
    import.meta.url
  ),
  "utf8"
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { default: Section } = await import(
  moduleUrl(
    code
      .replace('"react"', JSON.stringify(react))
      .replace('"../FriendGroup.styles"', JSON.stringify(styles))
      .replace(
        '"react/jsx-runtime"',
        JSON.stringify(import.meta.resolve("react/jsx-runtime"))
      )
  )
);

function nodes(tree) {
  if (tree == null || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}

test("group request tabs cancel by requestId and fall back to received invitations", () => {
  globalThis.__groupSentSelected = false;
  const calls = [];
  const props = {
    invitations: [
      { requestId: 15, groupName: "받은 모임", inviterNickname: "친구" },
    ],
    sentRequests: [{ requestId: 80, groupId: 1, groupName: "보낸 모임" }],
    cancelPending: false,
    onCancel: (id) => calls.push(id),
    onAccept() {},
    onReject() {},
  };
  const find = (tree, label) =>
    nodes(tree).find((node) => node.props?.["aria-label"] === label);
  assert.ok(find(Section(props), "받은 모임 그룹 초대 수락"));
  nodes(Section(props))
    .find((node) => node.props?.id === "group-requests-sent")
    .props.onClick();
  const cancelLabel = "보낸 모임 그룹 가입 신청 취소";
  assert.equal(
    find(Section({ ...props, cancelPending: true }), cancelLabel).props
      .disabled,
    true
  );
  find(Section(props), cancelLabel).props.onClick();
  assert.deepEqual(calls, [80]);
  assert.ok(
    find(Section({ ...props, sentRequests: [] }), "받은 모임 그룹 초대 수락")
  );
  assert.equal(Section({ ...props, sentRequests: [], invitations: [] }), null);
  delete globalThis.__groupSentSelected;
});
