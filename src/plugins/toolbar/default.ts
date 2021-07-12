import ArtText from "../../artText";
import { Art } from "../../core";
import Editor from "../../editor";
import EventCenter from "../../eventCenter";
import Toolbar from ".";
import Message from "../message";

export let exportMdFile = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({
            title: '导出', click: () => {
                {
                    let fileInfo = art.get<Editor>('$editor').getFile();
                    let filename = 'arttext';
                    if (fileInfo.name) {
                        filename = fileInfo.name;
                    }
                    let ele = document.createElement('a');
                    ele.download = filename + '.md';
                    ele.style.display = 'none';
                    // 字符内容转变成blob地址
                    let blob = new Blob([fileInfo.markdown]);
                    ele.href = URL.createObjectURL(blob);

                    document.body.appendChild(ele);
                    ele.click();
                    document.body.removeChild(ele);
                }
            }
        })
    }
}

export let importMdFile = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({
            title: '导入', click: () => {
                {
                    let ele = document.createElement('input');
                    ele.type = 'file';
                    ele.accept = '.md';
                    ele.style.display = 'none';

                    document.body.appendChild(ele);
                    ele.click();

                    ele.onchange = () => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            art.get<Editor>('$editor').openFile({ name: ele.files[0].name.replace(/.md$/, ''), defaultMd: reader.result.toString() });
                        }
                        reader.readAsText(ele.files[0], 'utf8');
                    }
                    document.body.removeChild(ele);
                }
            }
        })
    }
}

export let newMdFileExport = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({ title: '新建', click: () => art.get<Editor>('$editor').openFile() })
    }
}

export let GithubExport = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add(
            {
                title: '<span title="项目地址">Github</span>',
                click: () => window.open('https://github.com/liziqiang9/ArtText')
            }
        );
    }
}

export class SwitchRenderButton {

    artText: ArtText;
    spanElement: HTMLSpanElement;
    title: string;
    abbrNames: string[];
    renderNames: string[];
    constructor(artText: ArtText) {
        this.artText = artText;
        this.title = '默认';

        this.spanElement = null;
        this.abbrNames = [];
        this.renderNames = [];

        const _this = this;
        this.artText.get<EventCenter>('$eventCenter').on('@switchRenderButton-addRender',
            (abbrNames, renderName) => { 
                _this.addRender(abbrNames, renderName);
            })
    }

    public addRender(abbrNames: string, renderName: string): void{
        this.abbrNames.push(abbrNames);
        this.renderNames.push(renderName);
    }

    public click(): void {
        let index: number = this.abbrNames.indexOf(this.title);
        if (index > -1) {
            index++;
            if (index == this.abbrNames.length) {
                index = 0;
            }
            this.title = this.abbrNames[index];
            this.spanElement.innerHTML = this.abbrNames[index];
            try {
                this.artText.get<Editor>('$editor').switchRender(this.renderNames[index]);
            } catch (err) {
                console.error(err);
                this.artText.get<Message>('message').create('切换渲染器失败', 'error');
            }
        }
    }
}

export let switchRenderButtonExport = {
    install: (Art, options) => {
        options['container'].bind('switchRenderButton', SwitchRenderButton, [{ 'get': 'art' }], true);

    },
    created: function (art: Art, options) {
        let switchRenderBotton = art.get<SwitchRenderButton>('switchRenderButton');

        if (switchRenderBotton.abbrNames.length > 0)
            switchRenderBotton.title = switchRenderBotton.abbrNames[0];

        switchRenderBotton.spanElement = art.get<Toolbar>('toolbar').add(
            {
                title: switchRenderBotton.title,
                click: () => switchRenderBotton.click()
            }
        );
    }
}