import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import FontSize from "tiptap-extension-font-size";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { useMainContext } from "@/context/mainContext";
import { useRouter } from "next/router";
import Highlight from "@tiptap/extension-highlight";

interface BlogPost {
  title: string;
  header: string;
  coverImage: string;
  createdAt: string;
  id: string;
  category: string[];
  postItems: string;
  updatedAt: string;
  isPublished: boolean;
}

const Probaaaa = () => {
  const { editor } = useCurrentEditor();
  const { data, setData } = useMainContext();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = React.useState("");
  const [editorContent, setEditorContent] = React.useState("");
  const [selectedHighLight, setSelectedHighLight] = React.useState("");

  const handleColorChange = (event: any) => {
    const color = event.target.value;
    setSelectedColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  const handleHighlightChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const color = event.target.value;
    setSelectedHighLight(color);
    editor?.chain().focus().setHighlight({ color }).run();
  };

  useEffect(() => {
    if (!editor) return;

    // Update editor content on each change
    editor.on("update", () => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getJSON();
      setEditorContent(htmlContent);
      setData({
        ...data,
        postItems: htmlContent,
      });
      localStorage.setItem("editorContent", htmlContent);
      console.log(htmlContent);
    });
  }, [editor, data, setData]);

  const fontSizeOptions = Array.from({ length: 46 }, (_, i) => {
    const size = (i + 1) * 2 + 8;
    return { code: `${size}px`, name: `${size}` };
  });

  useEffect(() => {
    if (router.pathname !== "/blog/create") {
      editor?.commands.setContent(data.postItems);
    }
  }, []);

  const colorOptions = [
    { code: "#000000", name: "Fekete" },
    { code: "#FFFFFF", name: "Fehér" },
    { code: "#FF0000", name: "Piros" },
    { code: "#00FF00", name: "Zöld" },
    { code: "#0000FF", name: "Kék" },
    { code: "#FFFF00", name: "Sárga" },
    { code: "#FF00FF", name: "Lila" },
    { code: "#00FFFF", name: "Türkiz" },
    { code: "#C0C0C0", name: "Ezüst" },
    { code: "#808080", name: "Szürke" },
    { code: "#800000", name: "Bordó" },
    { code: "#808000", name: "Olajzöld" },
    { code: "#958DF1", name: "Levendula" },
    { code: "#FF6347", name: "Paradicsom" },
    { code: "#FFD700", name: "Arany" },
    { code: "#ADFF2F", name: "Zöldcitrom" },
    { code: "#20B2AA", name: "Világostürkiz" },
    { code: "#87CEFA", name: "Világoskék" },
    { code: "#FF69B4", name: "Rózsaszín" },
    { code: "#DC143C", name: "Vörös" },
    { code: "#00CED1", name: "Türkiz" },
    { code: "#8A2BE2", name: "Kékeslila" },
    { code: "#5F9EA0", name: "Fakókék" },
    { code: "#556B2F", name: "Olajzöld" },
    { code: "#FF4500", name: "Narancs" },
    { code: "#DAA520", name: "Aranybarna" },
    { code: "#2E8B57", name: "Tengerzöld" },
    { code: "#4682B4", name: "Acélkék" },
    { code: "#8B4513", name: "Kakaóbarna" },
    { code: "#6A5ACD", name: "Pávaszemkék" },
    { code: "#808080", name: "Szürke" },
    { code: "#008080", name: "Zöldes-kék" },
  ];

  const colorOptionsHighLights = [
    { code: "#000000", name: "Fekete" },
    { code: "#FFFFFF", name: "Fehér" },
    { code: "#FF0000", name: "Piros" },
    { code: "#00FF00", name: "Zöld" },
    { code: "#0000FF", name: "Kék" },
    { code: "#FFFF00", name: "Sárga" },
    { code: "#FF00FF", name: "Lila" },
    { code: "#00FFFF", name: "Türkiz" },
    { code: "#C0C0C0", name: "Ezüst" },
    { code: "#808080", name: "Szürke" },
    { code: "#800000", name: "Bordó" },
    { code: "#808000", name: "Olajzöld" },
    { code: "#958DF1", name: "Levendula" },
    { code: "#FF6347", name: "Paradicsom" },
    { code: "#FFD700", name: "Arany" },
    { code: "#ADFF2F", name: "Zöldcitrom" },
    { code: "#20B2AA", name: "Világostürkiz" },
    { code: "#87CEFA", name: "Világoskék" },
    { code: "#FF69B4", name: "Rózsaszín" },
    { code: "#DC143C", name: "Vörös" },
    { code: "#00CED1", name: "Türkiz" },
    { code: "#8A2BE2", name: "Kékeslila" },
    { code: "#5F9EA0", name: "Fakókék" },
    { code: "#556B2F", name: "Olajzöld" },
    { code: "#FF4500", name: "Narancs" },
    { code: "#DAA520", name: "Aranybarna" },
    { code: "#2E8B57", name: "Tengerzöld" },
    { code: "#4682B4", name: "Acélkék" },
    { code: "#8B4513", name: "Kakaóbarna" },
    { code: "#6A5ACD", name: "Pávaszemkék" },
    { code: "#808080", name: "Szürke" },
    { code: "#008080", name: "Zöldes-kék" },
  ];

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group flex flex-row items-center justify-center">
      <div className="button-group flex flex-row items-center justify-center gap-3 max-w-[1300px] flex-wrap">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setImage({
                src: window.prompt("Ide illeszd be a kép url címét") as string,
              })
              .run()
          }
        >
          Kép hozzáadása
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("bold") ? "bg-blue-900" : ""
          }`}
        >
          Vastag
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("italic") ? "bg-blue-900" : ""
          }`}
        >
          Dőlt
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("strike") ? "bg-blue-900" : ""
          }`}
        >
          Áthúzott
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("code") ? "bg-blue-900" : ""
          }`}
        >
          Kód
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("underline") ? "bg-blue-900" : ""
          }`}
          onClick={() => {
            if (window.confirm("Biztosan törölni szeretnéd a formázást?")) {
              editor.chain().focus().unsetAllMarks().run();
            }
          }}
        >
          Formázás törlése
        </button>
        {/* <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button> */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("paragraph") ? "bg-blue-900" : ""
          }`}
        >
          Szöveg
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("left") ? "bg-blue-900" : ""
          }`}
        >
          Balra zárás
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("center") ? "bg-blue-900" : ""
          }`}
        >
          Középre zárás
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("right") ? "bg-blue-900" : ""
          }`}
        >
          Jobbra zárás
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 1 }) ? "bg-blue-900" : ""
          }`}
        >
          Egyes fejléc
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-900" : ""
          }`}
        >
          Kettes fejléc
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 3 }) ? "bg-blue-900" : ""
          }`}
        >
          Hármas fejléc
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 4 }) ? "bg-blue-900" : ""
          }`}
        >
          Négyes fejléc
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 5 }) ? "bg-blue-900" : ""
          }`}
        >
          Ötös fejléc
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("heading", { level: 6 }) ? "bg-blue-900" : ""
          }`}
        >
          Hatos fejléc
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("bulletList") ? "bg-blue-900" : ""
          }`}
        >
          Pontos felsorolás
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("orderedList") ? "bg-blue-900" : ""
          }`}
        >
          Számozott felsorolás
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("codeBlock") ? "bg-blue-900" : ""
          }`}
        >
          Kód blokk
        </button>
        <button
          onClick={() => editor.chain().focus().setBlockquote().run()}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            editor.isActive("blockquote") ? "bg-blue-900" : ""
          }`}
        >
          Bekezdés
        </button>
        {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            Hard break
        </button> */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Visszavonás
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Mégis
        </button>
        <p>Szöveg színe:</p>
        <select
          value={selectedColor}
          onChange={handleColorChange}
          className={`bg-[${selectedColor}] border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-all duration-300 cursor-pointer`}
        >
          {colorOptions.map((color, index) => (
            <option
              key={index}
              value={color.code}
              className={`bg-[${color.code}]`}
              style={{ backgroundColor: color.code }}
            >
              {color.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Szöveg szín törlése
        </button>

        <p>Kiemelés színe:</p>

        <select
          value={selectedHighLight}
          onChange={handleHighlightChange}
          className="border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-all duration-300 cursor-pointer"
        >
          {colorOptionsHighLights.map((color, index) => (
            <option
              key={index}
              value={color.code}
              style={{ backgroundColor: color.code }}
            >
              {color.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
          Kiemelés törlése
        </button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: {
      alt: "An image",
    },
  }),
  ImageResize,
  BulletList.configure({
    HTMLAttributes: { class: "list-disc" },
  }),
  OrderedList.configure({
    HTMLAttributes: { class: "list-decimal" },
  }),
  ListItem.configure({
    HTMLAttributes: { class: "list-item" },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight.configure({ multicolor: true }),
];

export default (setData: any, data: any) => {
  return (
    <div className="bg-white text-black h-screen">
      <EditorProvider
        slotBefore={<Probaaaa />}
        extensions={extensions}
        editable={true}
        autofocus={true}
        editorContainerProps={{
          className:
            "bg-gray-100 text-black list-disc min-h-[300px] shadow-xl max-w-[1136px] mx-auto mt-10 p-2",
        }}
      ></EditorProvider>
    </div>
  );
};
