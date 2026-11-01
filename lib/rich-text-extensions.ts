// The visual editor's schema, shared by the editor component and the tests
// that check stored text survives a load → save round trip.
//
//   "rich"  — article text, FAQ answers, intros: paragraphs, line breaks,
//             bulleted/numbered lists, bold, italic, links.
//   "lines" — list items and table cells: one paragraph per stored line and
//             nothing else structural; bold, italic and links inside a line.

import StarterKit from "@tiptap/starter-kit";

export type EditorMode = "rich" | "lines";

export function starterKit(mode: EditorMode) {
  return StarterKit.configure({
    heading: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    ...(mode === "lines"
      ? { bulletList: false, orderedList: false, listItem: false, listKeymap: false, hardBreak: false, trailingNode: false }
      : {}),
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["mailto", "tel"],
    },
  });
}
