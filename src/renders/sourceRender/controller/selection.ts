import { fromEvent, Observable, tap } from "rxjs";
import { ArtRange } from "./range";
export class ArtSelection {
  nativeSelection: Selection;
  onChange: Observable<any>;
  /**
   * 获取 Selection 的第一个 Range。
   */
  get firstRange(): ArtRange {
    return this._ranges[0] || null;
  }
  private _ranges: ArtRange[];
  constructor(document: Document) {
    this.nativeSelection = document.getSelection();
    this.onChange = fromEvent(document, "selectionchange").pipe(
      tap(() => {
        this._ranges = [];
        for (let i = 0; i < this.nativeSelection.rangeCount; i++) {
          const nativeRange = this.nativeSelection.getRangeAt(i);
          this._ranges.push(new ArtRange(nativeRange.cloneRange()));
        }
      })
    );
  }
}
