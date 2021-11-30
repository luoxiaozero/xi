import { range } from "rxjs";

export class ArtRange {
  constructor(public nativeRange: Range) {}
  /**
   * 获取选区范围在文档中的坐标位置。
   */
  getRangePosition(): DOMRect {
    const range = this.nativeRange;
    const { startContainer, startOffset } = range;
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
        const offsetNode = startContainer.childNodes[startOffset];
        return (offsetNode as HTMLElement).getBoundingClientRect();
    }
    return range.getBoundingClientRect();
  }
}
