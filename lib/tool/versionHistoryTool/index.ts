import ArtText from "../..";
class VersionHistory {
    root: HTMLDivElement;
    maskLayer: HTMLDivElement;
    art_articles: {};
    sideDraftHistoryDirectory: HTMLDivElement;
    mainArticle: HTMLDivElement;
    constructor(artText: ArtText) {
        this.root = document.createElement("div");
        this.root.style.position = 'fixed';
        this.root.style.zIndex = '10';
        this.root.style.width = '59vw';
        this.root.style.height = '88vh';
        this.root.style.top = '5vh';
        this.root.style.backgroundColor = '#fff';
        this.root.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
        this.root.style.borderRadius = '2px';
        this.root.style.zIndex = '5'
        this.root.style.display = 'flex';

        this.maskLayer = document.createElement('div');
        this.maskLayer.style.position = 'fixed';
        this.maskLayer.style.top = '0';
        this.maskLayer.style.right = '0';
        this.maskLayer.style.bottom = '0';
        this.maskLayer.style.left = '0';
        this.maskLayer.style.background = 'rgba(26,26,26,.65)';
        this.maskLayer.style.zIndex = '1';

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
        sideTitle.style.borderBottom = '1px solid #ebebeb'
        sideTitle.innerHTML = '历史版本'
        
        let sideDraftHistory = document.createElement('div');
        sideDraftHistory.style.display = 'flex';
        sideDraftHistory.style.flexDirection = 'column';
        sideDraftHistory.style.justifyContent = 'center';
        sideDraftHistory.style.overflow = 'auto';
        this.sideDraftHistoryDirectory =  document.createElement('div');
        sideDraftHistory.appendChild(this.sideDraftHistoryDirectory);
        this.sideDraftHistoryDirectory.style.overflow = 'auto';

        if(localStorage.art_articles != undefined){
            this.art_articles = JSON.parse(localStorage.art_articles);
        }else{
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
        this.mainArticle.style.padding = '13px 8px';
        this.mainArticle.innerHTML =  '<pre style="background-color:#fff;">' + '无打开' + '</pre>';

        let mainF = document.createElement('div');
        mainF.style.height = '52px';
        mainF.style.display = 'flex';
        mainF.style.borderTop = '1px solid #ebebeb'

        dialogMain.appendChild(this.mainArticle);
        dialogMain.appendChild(mainF);

        this.root.appendChild(closeSpan);
        this.root.appendChild(dialogSide);
        this.root.appendChild(dialogMain);
        artText.container.appendChild(this.root);
        artText.container.appendChild(this.maskLayer);
        this.open();
    }
    open(){
        this.root.style.display = 'flex';
        this.maskLayer.style.display = 'inline';
        this.sideDraftHistoryDirectory.innerHTML = '';
        this.art_articles = JSON.parse(localStorage.art_articles);
        for(let key in this.art_articles){
            console.log(key);
            let div = document.createElement('div');
            div.style.height = '60px'
            div.style.padding = '10px 20px 0'
            div.style.borderBottom = '1px solid #eee'
            div.style.cursor = 'pointer';
            let time = new Date(parseInt(this.art_articles[key].time) * 1).toLocaleString().replace(/\//g, '-').substring(0, 16);
            div.innerHTML = '<div style="font-weight: 500;">' + time +'</div><div style="font-size: 12px;">当前草稿</div>';
            div.onclick = this.openMd(this, this.art_articles[key]);
            this.sideDraftHistoryDirectory.appendChild(div);
        }
    }
    openMd(vH: VersionHistory, article: {}){
        function c() {
            (<HTMLPreElement>vH.mainArticle.childNodes[0]).innerHTML = localStorage[article['ids'][0]];
        }
        return c;
    }
    close(){
        this.maskLayer.style.display = 'none';
        this.root.style.display = 'none';
    }
    /*setDialog(header, body, footer=''){
        footer;
        this.dialogTool.style.display = 'block';
        (<HTMLDivElement>this.dialogTool.childNodes[0]).innerHTML = header;
        this.dialogTool.childNodes[1].appendChild(body);
    }*/
}
export default VersionHistory