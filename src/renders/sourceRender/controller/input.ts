import { fromEvent } from "rxjs";
import SourceRender from "..";
import { ArtSelection } from "./selection";
import "./styles/input.css";

export class ArtInput {
  selectionEl: HTMLDivElement = document.createElement("div");
  inputWrapEl: HTMLSpanElement = document.createElement("span");
  inputEl: HTMLTextAreaElement = document.createElement("textarea");
  cursorEl: HTMLSpanElement = document.createElement("span");
  constructor(
    public sourceRender: SourceRender,
    public selection: ArtSelection
  ) {
    this.selectionEl.classList.add("art-selection");
    this.inputWrapEl.classList.add("art-selection-wrap");
    this.inputEl.classList.add("art-selection-input");
    this.inputWrapEl.appendChild(this.inputEl);
    this.cursorEl.classList.add("art-selection-cursor");
    this.selectionEl.appendChild(this.inputWrapEl);
    this.selectionEl.appendChild(this.cursorEl);
    this.sourceRender.editorContainerEl.appendChild(this.selectionEl);
    selection.onChange.subscribe(() => {
      this.updateSelection();
    });
    fromEvent(this.inputEl, "input").subscribe(console.log);
  }

  updateSelection() {
    this.updateCursorPosition();
    /**暂时不处理多光标 */
    if (this.selection.firstRange.nativeRange.collapsed) {
        this.cursorEl.style.display = "inherit";
    } else {
        this.cursorEl.style.display = "none";
    }
    this.inputEl.focus();
  }

  updateCursorPosition() {
    const rect = this.selection.firstRange.getRangePosition();
    let height = rect.height;
    this.selectionEl.style.left = rect.left + "px";
    this.selectionEl.style.top = rect.top + "px";
    this.selectionEl.style.height = height + "px";
    this.inputWrapEl.style.top = height + "px";
  }
}
