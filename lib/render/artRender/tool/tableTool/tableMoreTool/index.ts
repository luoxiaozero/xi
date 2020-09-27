import Cursor from '../../../cursor';

export class TableMoreTool {
    moreDom: HTMLUListElement;
    tableDom: HTMLTableElement;
    thtdDom: Node;

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
        let cell = -1;
        let selected;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        let tr = document.createElement('tr');
        if (_this.tableDom.rows[0] == refTr) {
            let tr2 = document.createElement('tr');
            for (let j = 0; j < refTr.childNodes.length; j++) {
                let th = document.createElement('th');
                if (j == cell) {
                    selected = th;
                }
                tr.appendChild(th);

                let td = document.createElement('td');
                for (let i = 0; i < refTr.childNodes[j].childNodes.length; i++) {
                    td.appendChild(refTr.childNodes[j].childNodes[i]);
                }
                tr2.appendChild(td);

                let style = (<HTMLElement>refTr.childNodes[j]).getAttribute('style');
                if (style) {
                    th.setAttribute('style', style);
                    td.setAttribute('style', style);
                }
            }
            refTr.parentNode.insertBefore(tr, refTr);
            refTr.parentNode.removeChild(refTr);
            _this.tableDom.rows[1].parentNode.insertBefore(tr2, _this.tableDom.rows[1]);
        } else {
            for (let j = 0; j < refTr.childNodes.length; j++) {
                let td = document.createElement('td');
                if (j == cell) {
                    selected = td;
                }
                tr.appendChild(td);
                let style = (<HTMLElement>refTr.childNodes[j]).getAttribute('style');
                if (style) {
                    td.setAttribute('style', style);
                }
            }
            refTr.parentNode.insertBefore(tr, refTr);
        }
        Cursor.setCursor(selected, 0);
    }

    private insertDownLine(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let cell = -1;
        let selected;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        let tr = document.createElement('tr');
        for (let j = 0; j < refTr.childNodes.length; j++) {
            let td = document.createElement('td');
            if (j == cell) {
                selected = td;
            }
            tr.appendChild(td);
            let style = (<HTMLElement>refTr.childNodes[j]).getAttribute('style');
            if (style) {
                td.setAttribute('style', style);
            }
        }

        if (_this.tableDom.rows[_this.tableDom.rows.length - 1] == refTr) {
            _this.tableDom.childNodes[1].appendChild(tr);
        } else if (_this.tableDom.rows[0] == refTr) {
            _this.tableDom.rows[1].parentNode.insertBefore(tr, _this.tableDom.rows[1]);
        } else {
            refTr.parentNode.insertBefore(tr, refTr.nextSibling);
        }
        Cursor.setCursor(selected, 0);
    }

    private insertLeftColumn(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let cell = -1;
        let selected;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        for (let j = 0; j < _this.tableDom.rows.length; j++) {
            let thtd;
            if (j == 0) {
                thtd = document.createElement('th');
            } else {
                thtd = document.createElement('td');
            }
            if (_this.tableDom.rows[j] == refTr) {
                selected = thtd;
            }
            _this.tableDom.rows[j].cells[cell].parentNode.insertBefore(thtd, _this.tableDom.rows[j].cells[cell]);

        }
        Cursor.setCursor(selected, 0);
    }

    private insertRightColumn(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let cell = -1;
        let selected;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        for (let j = 0; j < _this.tableDom.rows.length; j++) {
            let thtd;
            if (j == 0) {
                thtd = document.createElement('th');
            } else {
                thtd = document.createElement('td');
            }
            if (_this.tableDom.rows[j] == refTr) {
                selected = thtd;
            }
            if(_this.tableDom.rows[j].cells[cell].nextSibling)
                _this.tableDom.rows[j].cells[cell].parentNode.insertBefore(thtd, _this.tableDom.rows[j].cells[cell].nextSibling);
            else
                _this.tableDom.rows[j].cells[cell].parentNode.appendChild(thtd);
        }
        Cursor.setCursor(selected, 0);
    }

    private deleteLine(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let cell = -1, row = -1;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        for (let j = 0; j < _this.tableDom.rows.length; j++) {
            if(_this.tableDom.rows[j] == refTr){
                row = j;
                break;
            }   
        }
        refTr.parentNode.removeChild(refTr);
        Cursor.setCursor(_this.tableDom.rows[row].cells[cell], 0);
    }

    private deleteColumn(_this: TableMoreTool) {
        let refTr = _this.thtdDom.parentNode;
        let cell = -1, row = -1;
        for (let j = 0; j < refTr.childNodes.length; j++) {
            if (refTr.childNodes[j] == _this.thtdDom) {
                cell = j;
                break;
            }
        }

        for (let j = 0; j < _this.tableDom.rows.length; j++) {
            if(_this.tableDom.rows[j] == refTr){
                row = j;
            }   
            _this.tableDom.rows[j].cells[cell].parentNode.removeChild(_this.tableDom.rows[j].cells[cell]);
        }
        Cursor.setCursor(_this.tableDom.rows[row].cells[cell], 0);
    }

    public open(xy: [number, number], table: HTMLTableElement): void {
        let { anchorNode, anchorOffset } = Cursor.sel;
        Cursor.setCursor(anchorNode, anchorOffset);
        let node = anchorNode;
        while (node.parentNode.nodeName != 'TR' && node.parentNode != document.body) {
            node = node.parentNode;
        }
        if (node.parentNode.nodeName == 'TR') {
            this.thtdDom = node;
            this.moreDom.style.display = 'inherit';
            this.tableDom = table;
            this.moreDom.style.top = xy[1].toString() + 'px';
            this.moreDom.style.left = xy[0].toString() + 'px';
        }
    }

    public close(): void {
        this.moreDom.style.display = 'none';
    }
}