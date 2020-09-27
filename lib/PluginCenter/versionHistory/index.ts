import { _Object_ } from "..";
import ArtText from 'lib';
import Tool from 'lib/tool';

export class OpenVersionHistory {
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '历史'
    }

    click() {
        this._object_.parentPlugin.open();
    }
}

export class SaveMdFile {
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '保存';
    }

    click() {
        let [md, fileInfo] = this._object_.getFile();
        let art_articles = JSON.parse(localStorage.art_articles);
        if (fileInfo['id'] && art_articles.hasOwnProperty(fileInfo['id'])) {
            localStorage[fileInfo['id']] = md;
            art_articles[fileInfo['id']] = fileInfo;
            localStorage.art_articles = JSON.stringify(art_articles);
            Tool.message('md保存成功', 'success');
        } else {
            let timestamp = new Date().getTime();
            let mdId = 'art_md_' + timestamp + '_';
            let name = mdId;
            if (fileInfo['name']) {
                mdId += fileInfo['name'];
                name = fileInfo['name'];
            }
            localStorage[mdId] = md;
            art_articles[mdId] = { ids: [mdId], time: timestamp, name: name, id: mdId }
            localStorage.art_articles = JSON.stringify(art_articles);
            this._object_.openFile(md, art_articles[mdId]);
            Tool.message('md保存成功', 'success');
        }
    }
}

export default class VersionHistory {
    static codeDescribe = 'Tool.add';
    static Plugins: {} = { OpenVersionHistory, SaveMdFile };

    _object_: _Object_;

    dom: HTMLDivElement;
    maskLayer: HTMLDivElement;
    art_articles: {};
    sideDraftHistoryDirectory: HTMLDivElement;
    mainArticle: HTMLDivElement;
    footerDel: HTMLSpanElement;
    footerRestore: HTMLSpanElement;
    footerTag: HTMLSpanElement;
    mainFooter: HTMLDivElement;
    constructor(_object_: _Object_) {
        this._object_ = _object_;
        ArtText.DEFAULT_CSS += '.art-VersionHistoryTool{position: fixed;z-index:10;width:60vw;right:20vw;height:92vh;top:4vh;background-color:#fff;box-shadow:0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 2px}\n\
        .art-VersionHistoryTool-MaskLayer{position:fixed;top:0;right:0;bottom:0;left:0;background: rgba(26,26,26,.65);z-index:1}\n\
        .art-VersionHistoryTool-selected{color: #1aba9c}'
    }

    public getRootDomChilds(): Node[] {
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-VersionHistoryTool');
        this.dom.style.display = 'none';

        this.maskLayer = document.createElement('div');
        this.maskLayer.setAttribute('class', 'art-VersionHistoryTool-MaskLayer');
        this.maskLayer.style.display = 'none';

        let closeSpan = document.createElement('span');
        closeSpan.style.position = 'absolute';
        closeSpan.style.right = '-60px';
        closeSpan.style.padding = '12px';
        closeSpan.style.cursor = 'pointer';
        closeSpan.style.color = '#fff';
        closeSpan.innerHTML = '<svg class="icon" style="width: 30px; height: 30px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1187"><path d="M557.252647 512l135.75794 135.75794c12.495592 12.495592 12.495592 32.757055 0 45.252647-12.495592 12.495592-32.757055 12.495592-45.252647 0L512 557.252647 376.24206 693.010587c-12.496615 12.496615-32.757055 12.495592-45.252647 0-12.495592-12.495592-12.496615-32.756031 0-45.252647l135.75794-135.75794L330.989413 376.24206c-12.496615-12.496615-12.495592-32.757055 0-45.252647 12.495592-12.495592 32.756031-12.496615 45.252647 0l135.75794 135.75794 135.75794-135.75794c12.495592-12.495592 32.756031-12.495592 45.252647 0 12.495592 12.495592 12.495592 32.757055 0 45.252647L557.252647 512z m-429.233972 0c0 212.062813 171.918511 383.981325 383.981325 383.981325s383.981325-171.918511 383.981325-383.981325S724.06179 128.018675 512 128.018675 128.018675 299.937187 128.018675 512z m-63.997569 0c0-247.406786 200.572108-447.978894 447.978894-447.978894S959.977871 264.593214 959.977871 512 759.405763 959.977871 512 959.977871 64.021106 759.405763 64.021106 512z" p-id="1188"></path></svg>'
        function closure(vH: VersionHistory) {
            function c() {
                vH.close();
            }
            return c;
        }
        closeSpan.onclick = closure(this);

        let dialogSide = document.createElement('div');
        dialogSide.style.display = 'flex';
        dialogSide.style.width = '210px';
        dialogSide.style.flexDirection = 'column';
        dialogSide.style.borderRight = '1px solid #ebebeb'

        let sideTitle = document.createElement('div');
        sideTitle.style.padding = '12px 20px';
        sideTitle.style.fontWeight = '600';
        sideTitle.style.display = 'flex';
        sideTitle.innerHTML = '历史版本'

        let sideDraftHistory = document.createElement('div');
        sideDraftHistory.style.display = 'flex';
        sideDraftHistory.style.flexDirection = 'column';
        sideDraftHistory.style.justifyContent = 'center';
        sideDraftHistory.style.overflow = 'auto';
        this.sideDraftHistoryDirectory = document.createElement('div');
        sideDraftHistory.appendChild(this.sideDraftHistoryDirectory);
        this.sideDraftHistoryDirectory.style.overflow = 'auto';

        if (localStorage.art_articles != undefined) {
            this.art_articles = JSON.parse(localStorage.art_articles);
        } else {
            this.art_articles = {}
            localStorage.art_articles = JSON.stringify(this.art_articles);
        }

        dialogSide.appendChild(sideTitle);
        dialogSide.appendChild(sideDraftHistory);

        let dialogMain = document.createElement('div');
        dialogMain.style.flex = '1 1';
        dialogMain.style.display = 'flex';
        dialogMain.style.flexDirection = 'column';
        dialogMain.style.overflow = 'auto';

        this.mainArticle = document.createElement('div');
        this.mainArticle.style.flex = '1 1';
        this.mainArticle.style.display = 'flex';
        this.mainArticle.style.overflow = 'auto';
        this.mainArticle.innerHTML = '<textarea style="width: 100%;border: none;resize: none;outline: none;padding:13px 15px;font-size: 15px" readonly class="markdown-body">' + '无打开' + '</textarea>';

        this.mainFooter = document.createElement('div');
        this.mainFooter.style.height = '52px';
        this.mainFooter.style.display = 'flex';
        this.mainFooter.style.borderTop = '1px solid #ebebeb'
        this.mainFooter.style.alignItems = 'center';
        this.mainFooter.style.padding = '0 20px';

        this.footerDel = document.createElement('button');
        this.footerDel.setAttribute('style', 'border-radius: 18px;margin-right: 20px;color:#e01a1a;border:none;padding: 7px;font-size: 13px;font-weight: 600;background: rgba(239, 26, 26, 0.08);cursor: pointer;')
        this.footerDel.innerHTML = '<svg class="icon" style="width: 17px; height: 17px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="689"><path d="M800.162002 316.659033c1.850138-17.575284 17.596773-30.322609 35.172058-28.473495 17.575284 1.850138 30.322609 17.596773 28.473494 35.172058l-57.966202 550.673811c-5.143137 48.856731-46.341445 85.946464-95.467306 85.946464H313.625954c-49.126884 0-90.325192-37.089733-95.468329-85.946464L160.192446 323.358619c-1.850138-17.575284 10.898211-33.32192 28.472471-35.172057 17.575284-1.850138 33.32192 10.898211 35.172058 28.473494l57.965179 550.672788c1.714038 16.285918 15.446807 28.64848 31.822776 28.648481h396.74707c16.375969 0 30.108738-12.363585 31.822776-28.648481l57.967226-550.673811z m-192.176904 99.345636c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-191.990662 0c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-31.998785-223.989447h255.987209v-47.998178c0-8.836249-7.163143-15.999392-15.999393-15.999392H399.995043c-8.836249 0-15.999392 7.163143-15.999392 15.999392v47.998178z m-63.996546 0V128.018675c0-35.344996 28.652574-63.996546 63.997569-63.996546h255.987209c35.343973 0 63.996546 28.652574 63.996546 63.996546v63.996547h223.99968c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998784H96.019891c-17.672498 0-31.998785-14.326287-31.998785-31.998784s14.326287-31.998785 31.998785-31.998785h223.979214z" p-id="690"></path></svg>';

        this.footerTag = document.createElement('button');
        this.footerTag.setAttribute('style', 'border-radius: 18px;margin-right: 20px;color:#ebeb18;border:none;padding: 7px;font-size: 13px;font-weight: 600;background: rgba(229, 229, 109, 0.1);cursor: pointer;')
        //this.footerTag.innerHTML = '<svg class="icon" style="width: 17px; height: 17px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1429"><path d="M512 203.084325L577.199954 400.072815l14.522762 43.887556h244.308215l-157.179832 131.697461-31.530111 26.41665 10.937097 39.653115 56.411801 204.547652-165.589363-117.718075-37.080523-26.360367-37.080523 26.361391-165.597549 117.722168 56.418964-204.552769 10.937096-39.652092-31.53011-26.417673-157.179832-131.697461h244.304121l14.526855-43.887556 65.200978-196.98849m0-139.063219c-11.816117 0-23.63121 6.791683-28.127617 20.375049l-97.82705 295.566646H93.719498c-27.710109 0-40.267099 34.785248-18.987446 52.612265L304.048831 624.711038l-82.039481 297.444413c-5.655813 20.513196 10.561543 37.82242 28.662806 37.82242 5.698792 0 11.585873-1.717108 17.030885-5.588275l244.296959-173.672458L756.301052 954.389596c5.445012 3.873214 11.335163 5.588275 17.030885 5.588275 18.10024 0 34.31862-17.310248 28.65462-37.82242L719.951169 624.712061l229.316779-192.135972c21.280676-17.827017 8.725732-52.612265-18.991539-52.612264H637.954667L540.127617 84.396155c-4.496407-13.583366-16.311501-20.37505-28.127617-20.375049z" p-id="1430"></path></svg>'
        this.footerTag.innerHTML = '<svg class="icon" style="width: 18px; height: 18px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2298"><path d="M512 64.021106c-11.816117 0-23.63121 6.791683-28.127617 20.375049l-97.82705 295.566646H93.719498c-27.710109 0-40.267099 34.785248-18.987446 52.612265L304.048831 624.711038l-82.039481 297.444413c-5.655813 20.513196 10.561543 37.82242 28.662806 37.82242 5.698792 0 11.585873-1.717108 17.030885-5.588275l244.296959-173.672458L756.301052 954.389596c5.445012 3.873214 11.335163 5.588275 17.030885 5.588275 18.10024 0 34.31862-17.310248 28.65462-37.82242L719.951169 624.712061l229.316779-192.135972c21.280676-17.827017 8.725732-52.612265-18.991539-52.612264H637.954667L540.127617 84.396155c-4.496407-13.583366-16.311501-20.37505-28.127617-20.375049z" p-id="2299"></path></svg>'
        this.footerRestore = document.createElement('button');
        this.footerRestore.setAttribute('style', 'border-radius: 6px;flex: 1 1;color:#1aba9c;border:none;padding: 6px 15px;font-size: 13px;font-weight: 600;background: rgba(26, 186, 156, 0.08);cursor: pointer;')
        this.footerRestore.innerHTML = '恢复';
        this.mainFooter.appendChild(this.footerDel);
        this.mainFooter.appendChild(this.footerTag);
        this.mainFooter.appendChild(this.footerRestore);

        dialogMain.appendChild(this.mainArticle);
        dialogMain.appendChild(this.mainFooter);

        this.dom.appendChild(closeSpan);
        this.dom.appendChild(dialogSide);
        this.dom.appendChild(dialogMain);
        return [this.dom, this.maskLayer];
    }

    /**打开历史工具 */
    public open(): void {
        this.dom.style.display = 'flex';
        this.maskLayer.style.display = 'inline';
        this.art_articles = JSON.parse(localStorage.art_articles);
        document.body.style.overflow = 'hidden';
        (<HTMLPreElement>this.mainArticle.childNodes[0]).innerHTML = '';
        this.updateDirectory();
    }

    private updateDirectory(): void {
        this.sideDraftHistoryDirectory.innerHTML = '';
        let fileInfo = this._object_.getFile('fileInfo');
        for (let key of Object.keys(this.art_articles).reverse()) {
            let div = document.createElement('div');
            div.style.height = '60px'
            div.style.padding = '10px 20px 0'
            div.style.cursor = 'pointer';
            let time = new Date(parseInt(this.art_articles[key].time) * 1).toLocaleString().replace(/\//g, '-').substring(0, 16);
            let name = this.art_articles[key].name;
            if (fileInfo['id'] && fileInfo['id'] == key) {
                name = '@当前草稿';
                let article = this.art_articles[key];
                let md = localStorage[article['id']];
                let showNodeList = this.sideDraftHistoryDirectory.getElementsByClassName("art-VersionHistoryTool-selected");
                for (let i = showNodeList.length - 1; i >= 0; i--) {
                    let classVal = showNodeList[i].getAttribute("class");
                    classVal = classVal.replace("art-VersionHistoryTool-selected", '');
                    showNodeList[i].setAttribute("class", classVal);
                }
                div.setAttribute("class", 'art-VersionHistoryTool-selected');
                (<HTMLPreElement>this.mainArticle.childNodes[0]).innerHTML = md;
                this.mainFooter.style.display = 'inherit';
                let vH = this;
                this.footerDel.onclick = () => { localStorage.removeItem(article['ids'][0]); delete vH.art_articles[article['id']]; vH.updateDirectory(); Tool.message(article['name'] + '已删除', 'success') }
                this.footerRestore.onclick = () => { vH._object_.openFile(md, article); Tool.message(article['name'] + '已恢复', 'success'); vH.close(); }
            }

            div.innerHTML = `<div style="font-weight: 500;">${time}</div><div style="font-size: 12px;color: #555;">${name}</div>`;
            div.onclick = this.restoreMdFile(this.art_articles[key]);
            this.sideDraftHistoryDirectory.appendChild(div);
        }
    }

    private restoreMdFile(article: {}): any {
        let md = localStorage[article['id']];
        let vH: VersionHistory = this;
        function c() {
            let showNodeList = vH.sideDraftHistoryDirectory.getElementsByClassName("art-VersionHistoryTool-selected");
            for (let i = showNodeList.length - 1; i >= 0; i--) {
                let classVal = showNodeList[i].getAttribute("class");
                classVal = classVal.replace("art-VersionHistoryTool-selected", '');
                showNodeList[i].setAttribute("class", classVal);
            }
            this.setAttribute("class", 'art-VersionHistoryTool-selected');
            (<HTMLPreElement>vH.mainArticle.childNodes[0]).innerHTML = md;
            vH.mainFooter.style.display = 'inherit';
            vH.footerDel.onclick = () => { localStorage.removeItem(article['ids'][0]); delete vH.art_articles[article['id']]; vH.updateDirectory(); Tool.message(article['name'] + '已删除', 'success') }
            vH.footerRestore.onclick = () => { vH._object_.openFile(md, article); Tool.message(article['name'] + '已恢复', 'success'); vH.close(); }
        }
        return c;
    }

    /**关闭历史工具 */
    public close(): void {
        localStorage.art_articles = JSON.stringify(this.art_articles);
        this.maskLayer.style.display = 'none';
        this.dom.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}