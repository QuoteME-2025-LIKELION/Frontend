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
    RequestTabPanel = "div", RequestItem = "article", SentRequestItem = "article",
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
  assert.ok(find(Section(props), "받은 모임 그룹 초대 승인"));
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
    find(Section({ ...props, sentRequests: [] }), "받은 모임 그룹 초대 승인")
  );
  assert.equal(Section({ ...props, sentRequests: [], invitations: [] }), null);
  delete globalThis.__groupSentSelected;
});

test("group tabs connect to distinct panels and move selection and focus with the keyboard", () => {
  globalThis.__groupSentSelected = false;
  const props = {
    invitations: [{ requestId: 15, groupName: "받은 모임" }],
    sentRequests: [{ requestId: 80, groupName: "보낸 모임" }],
  };
  const focus = [];
  const press = (tab, key) => {
    let prevented = false;
    tab.props.onKeyDown({
      key,
      preventDefault: () => {
        prevented = true;
      },
      currentTarget: {
        ownerDocument: {
          getElementById: (id) => ({ focus: () => focus.push(id) }),
        },
      },
    });
    return prevented;
  };
  const groups = () => {
    const tree = nodes(Section(props));
    assert.ok(tree.some((node) => node.props?.role === "tablist"));
    const tabs = tree.filter((node) => node.props?.role === "tab");
    const panels = tree.filter((node) => node.props?.role === "tabpanel");
    for (const tab of tabs) {
      const panel = panels.find(
        (item) => item.props.id === tab.props["aria-controls"]
      );
      assert.equal(panel.props["aria-labelledby"], tab.props.id);
      assert.equal(panel.props.hidden, !tab.props["aria-selected"]);
      assert.equal(tab.props.tabIndex, panel.props.hidden ? -1 : 0);
    }
    return tabs;
  };
  assert.equal(press(groups()[0], "ArrowRight"), true);
  assert.equal(groups()[1].props["aria-selected"], true);
  assert.equal(press(groups()[1], "ArrowLeft"), true);
  assert.equal(groups()[0].props["aria-selected"], true);
  assert.equal(press(groups()[0], "End"), true);
  assert.equal(press(groups()[1], "Home"), true);
  assert.equal(press(groups()[0], "Tab"), false);
  assert.deepEqual(focus, [
    "group-requests-sent",
    "group-requests-received",
    "group-requests-sent",
    "group-requests-received",
  ]);
  delete globalThis.__groupSentSelected;
});
