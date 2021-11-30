import ArtText from "@/artText";
import { Art } from "@/core";
import Editor from "@/editor";
import EventCenter from "@/eventCenter";
import Render from "..";
import VNode from "../artRender/node";
import Parser from "../artRender/parser";
import Root from "./model/components/Root";
import { ArtSelection } from "./controller/selection";
import "./index.css";
import { ArtInput } from "./controller/input";

export default class SourceRender implements Render {
  abbrName: string = "Source";
  rootEl: HTMLDivElement = document.createElement("div");
  editorContainerEl: HTMLDivElement = document.createElement("div");
  editorIFrameEl: HTMLIFrameElement = document.createElement("iframe");
  contentDocument: Document;
  doc: Root;
  selection: ArtSelection;
  input: ArtInput;
  constructor(public artText: ArtText) {}

  public createDom(): HTMLDivElement {
    this.rootEl.classList.add("art-source");
    this.editorContainerEl.classList.add("art-source-container");
    this.editorIFrameEl.classList.add("art-source-iframe");
    this.editorIFrameEl.src = `javascript:void(
            (function () {
              document.open();
              document.write('<!DOCTYPE html><html lang="zh"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <style> body { margin: 0; }</style></head><body>1111111111111111111111111111111111111111111</body></html>');
              document.close();
            })()
            )`;
    this.editorIFrameEl.onload = () => {
      this.contentDocument = this.editorIFrameEl.contentDocument;
      this.selection = new ArtSelection(this.contentDocument);
      this.input = new ArtInput(this, this.selection);
    };
    this.editorContainerEl.appendChild(this.editorIFrameEl);
    this.rootEl.appendChild(this.editorContainerEl);
    return this.rootEl;
  }

  public open(): void {
    this.rootEl.style.display = "inherit";
  }

  public close(): void {
    this.rootEl.style.display = "none";
  }

  public getMd(): string {
    return this.doc.toMd();
  }

  public setMd(md: string): void {
    const parser = new Parser({});
    // this.dom.innerHTML = "";
    // this.doc = new Root(parser.parse(md), this.dom);
  }

  public attachAllEvent(): void {}

  public detachAllEvent(): void {}
}

export let sourceRenderRenderExport = {
  install: function (Art, options) {
    options["container"].bind(
      "sourceRender",
      SourceRender,
      [{ get: "art" }],
      true
    );
  },
  created: function (art: Art, options) {
    art
      .get<Editor>("$editor")
      .addRender("sourceRender", art.get("sourceRender"));
    art.get<Editor>("$editor").defaultRender = art.get("sourceRender");
  },
};
