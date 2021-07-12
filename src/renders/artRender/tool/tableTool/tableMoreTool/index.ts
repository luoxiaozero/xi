import VNode from '../../../../../renders/artRender/node';
import ArtRender from '../../../../../renders/artRender';
import Cursor from '../../../cursor';

export class TableMoreTool {
    moreDom: HTMLUListElement;
    tableDom: HTMLTableElement;
    tableNode: VNode;
    thtdDom: Node;
    thtdNode: VNode;
    pos: { column: number, row: number };
    artRender: ArtRender;
    constructor() {
        this.moreDom = null;
    }

    private createLi(text: string, fun: Function) {
        let li = document.createElement('li');
        li.className = 'art-floatTool-li';
        li.innerHTML = text;

        let _this = this;
        function c() {
            fun(_this);
            _this.close();
        }
        li.onclick = c as any;

        this.moreDom.appendChild(li);
    }

    public createDom(): HTMLUListElement {
        this.moreDom = document.createElement('ul');
        this.moreDom.style.display = 'none';
        this.moreDom.setAttribute('class', 'art-floatTool');

        this.createLi('上方插入一行', this.insertUpLine);
        this.createLi('下方插入一行', this.insertDownLine);

        let li = document.createElement('li');
        li.className = 'art-divider';
        this.moreDom.appendChild(li);

        this.createLi('左边插入一列', this.insertLeftColumn);
        this.createLi('右边插入一列', this.insertRightColumn);

        li = document.createElement('li');
        li.className = 'art-divider';
        this.moreDom.appendChild(li);

        this.createLi('删除行', this.deleteLine);
        this.createLi('删除列', this.deleteColumn);

        return this.moreDom;
    }

    private insertUpLine(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let selected: VNode;

        let tr = new VNode("tr");
        if (_this.tableDom.rows[0] == refTr) {
            let tr2 = new VNode("tr"), child_th = _this.thtdNode.parent.firstChild;
            for (let j = 0; j < refTr.childNodes.length && child_th; j++, child_th = child_th.next) {
                let th = new VNode("th");
                if (j == _this.pos.column)
                    selected = th;

                tr.appendChild(th);

                let td = new VNode("td");
                let md = child_th.getMd();
                if (md.length && md.charCodeAt(md.length - 1) === 10)
                    md = md.substring(0, md.length - 1);
                td._string_content = md;
                _this.artRender.interaction.parser.inlineParse(td);
                tr2.appendChild(td);

                let style = (<HTMLElement>refTr.childNodes[j]).getAttribute('style');
                if (style) {
                    th._info.style = style;
                    td._info.style = style;
                }
            }
            _this.artRender.operation.replace(tr, _this.tableNode.firstChild.firstChild)
            _this.artRender.operation.insertBefore(tr2, _this.tableNode.lastChild.firstChild)
        } else {
            for (let j = 0; j < refTr.childNodes.length; j++) {
                let td = new VNode("td");
                if (j == _this.pos.column)
                    selected = td;

                let style = (<HTMLElement>refTr.childNodes[j]).getAttribute('style');
                if (style) {
                    td._info.style = style;
                }
                tr.appendChild(td);
            }
            _this.artRender.operation.insertBefore(tr, _this.thtdNode.parent)
        }
        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    private insertDownLine(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let selected: VNode;

        let tr = new VNode("tr");
        for (let i = 0; i < refTr.childNodes.length; i++) {
            let td = new VNode("td");
            if (i == _this.pos.column)
                selected = td;

            tr.appendChild(td);
            let style = (<HTMLElement>refTr.childNodes[i]).getAttribute('style');
            if (style)
                td._info.style = style;
        }

        if (_this.tableDom.rows[_this.tableDom.rows.length - 1] == refTr) {
            _this.artRender.operation.appendChild(tr, _this.thtdNode.parent);
        } else if (_this.tableDom.rows[0] == refTr) {
            _this.artRender.operation.insertBefore(tr, _this.tableNode.lastChild.firstChild)
        } else {
            _this.artRender.operation.insertAfter(tr, _this.thtdNode.parent)
        }
        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    private insertLeftColumn(_this: TableMoreTool) {
        let selected: VNode, newNode: VNode;

        let th = _this.tableNode.firstChild.firstChild.firstChild;
        for (let i = 0; i < _this.pos.column; i++) {
            th = th.next;
        }
        newNode = new VNode("th");
        if (_this.pos.row === 0)
            selected = newNode;
        _this.artRender.operation.insertBefore(newNode, th);
        let tr = _this.tableNode.lastChild.firstChild, td: VNode;
        for (let j = 1; j < _this.tableDom.rows.length; j++, tr = tr.next) {
            td = tr.firstChild;
            for (let i = 0; i < _this.pos.column; i++) {
                td = td.next;
            }
            newNode = new VNode("td");
            if (_this.pos.row === j)
                selected = newNode;
            _this.artRender.operation.insertBefore(newNode, td);
        }

        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    private insertRightColumn(_this: TableMoreTool) {
        let selected: VNode, newNode: VNode;

        let th = _this.tableNode.firstChild.firstChild.firstChild;
        for (let i = 0; i < _this.pos.column; i++) {
            th = th.next;
        }
        newNode = new VNode("th");
        if (_this.pos.row === 0)
            selected = newNode;

        _this.artRender.operation.insertAfter(newNode, th);
        let tr = _this.tableNode.lastChild.firstChild, td: VNode;
        for (let j = 1; j < _this.tableDom.rows.length; j++, tr = tr.next) {
            td = tr.firstChild;
            for (let i = 0; i < _this.pos.column; i++) {
                td = td.next;
            }
            newNode = new VNode("td");
            if (_this.pos.row === j)
                selected = newNode;
            _this.artRender.operation.insertAfter(newNode, td);
        }

        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    private deleteLine(_this: TableMoreTool) {
        let selected: VNode, newNode: VNode;
        if (_this.pos.row) {
            let tr = _this.tableNode.lastChild.firstChild;
            for (let i = 1; i < _this.pos.row; i++) {
                tr = tr.next;
            }
            newNode = tr.next;
            for (let i = 0; i < _this.pos.column; i++) {
                newNode = newNode.next;
            }
            selected = newNode;
            _this.artRender.operation.remove(tr);
        } else {
            let tr = new VNode("tr");
            let td = _this.tableNode.lastChild.firstChild.firstChild;
            while (td) {
                let th = new VNode("th");
                let style = (td.dom as HTMLElement).getAttribute('style');
                if (style)
                    th._info.style = style;
                let md = td.getMd();
                if (md.length && md.charCodeAt(md.length - 1) === 10)
                    md = md.substring(0, md.length - 1);
                th._string_content = md;
                _this.artRender.interaction.parser.inlineParse(th);
                tr.appendChild(th);
                td = td.next;
            }
            _this.artRender.operation.replace(tr, _this.tableNode.firstChild.firstChild);
            _this.artRender.operation.remove(_this.tableNode.lastChild.firstChild);
            newNode = tr.firstChild;
            for (let i = 0; i < _this.pos.column; i++) {
                newNode = newNode.next;
            }
            selected = newNode;
        }
        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    private deleteColumn(_this: TableMoreTool) {
        let selected: VNode, newNode: VNode;

        let th = _this.tableNode.firstChild.firstChild.firstChild;
        for (let i = 0; i < _this.pos.column; i++) {
            th = th.next;
        }
        if (_this.pos.row === 0) {
            if (th.next)
                selected = th.next;
            else
                selected = th.prev;
        }
        _this.artRender.operation.remove(th);

        let tr = _this.tableNode.lastChild.firstChild, td: VNode;
        for (let j = 1; j < _this.tableDom.rows.length; j++, tr = tr.next) {
            td = tr.firstChild;
            for (let i = 0; i < _this.pos.column; i++) {
                td = td.next;
            }
            if (_this.pos.row === j) {
                if (td.next)
                    selected = td.next;
                else
                    selected = td.prev;
            }

            _this.artRender.operation.remove(td);
        }
        _this.artRender.operation.update();
        Cursor.setCursor(selected.dom, 0);
    }

    public open(artRender: ArtRender, detail: { xy: [number, number], table: HTMLTableElement }): void {
        this.artRender = artRender;
        let { anchorNode, anchorOffset } = Cursor.sel;
        Cursor.setCursor(anchorNode, anchorOffset);
        let dom = anchorNode;
        while (dom.parentNode.nodeName != 'TR' && dom.parentNode != document.body) {
            dom = dom.parentNode;
        }
        if (dom.parentNode.nodeName == 'TR') {
            this.thtdDom = dom;
            this.moreDom.style.display = 'inherit';
            this.moreDom.style.top = detail.xy[1].toString() + 'px';
            this.moreDom.style.left = detail.xy[0].toString() + 'px';

            let vnode = artRender.doc.firstChild, i = artRender.cursor.pos.rowAnchorOffset;
            while (--i != -1) {
                vnode = vnode.next;
            }
            this.tableNode = vnode;
            this.tableDom = this.tableNode.dom.childNodes[1] as HTMLTableElement;
            this.pos = { column: 0, row: 0 };
            let th = this.tableNode.firstChild.firstChild.firstChild;
            while (th) {
                if (th.dom === artRender.cursor.pos.rowNode) {
                    this.thtdNode = th;
                    break;
                }
                this.pos.column++;
                th = th.next;
            }
            if (!th) {
                let tr = this.tableNode.lastChild.firstChild, td: VNode;
                while (tr) {
                    td = tr.firstChild;
                    this.pos.row++;
                    this.pos.column = 0;
                    while (td) {
                        if (td.dom === artRender.cursor.pos.rowNode) {
                            this.thtdNode = td;
                            break;
                        }
                        this.pos.column++;
                        td = td.next;
                    }
                    if (td) {
                        break;
                    }
                    tr = tr.next;
                }
            }
        }
    }

    public close(): void {
        this.moreDom.style.display = 'none';
    }
}