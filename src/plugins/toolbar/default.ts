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
        art.get<Toolbar>('toolbar').addButton('<svg style="fill: currentColor;width: 22px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="32" d="M256 112v288"></path><path fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="32" d="M400 256H112"></path></svg>'
         ,() => art.get<Editor>('$editor').openFile(), '新建')
    }
}

export let GithubExport = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').addButton(
                '<svg style="fill: currentColor;width: 18px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 0 0 3.8.4c8.3 0 11.5-6.1 11.5-11.4c0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 0 1-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5c-10.2-26.5-24.9-33.6-24.9-33.6c-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8c11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0 0 25.6-6c2-14.8 7.8-24.9 14.2-30.7c-49.7-5.8-102-25.5-102-113.5c0-25.1 8.7-45.6 23-61.6c-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 0 1 5-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 0 1 112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 0 1 5 .5c12.2 31.6 4.5 55 2.2 60.8c14.3 16.1 23 36.6 23 61.6c0 88.2-52.4 107.6-102.3 113.3c8 7.1 15.2 21.1 15.2 42.5c0 30.7-.3 55.5-.3 63c0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 0 0 4-.4C415.9 449.2 480 363.1 480 261.7C480 134.9 379.7 32 256 32z" fill="currentColor"></path></svg>',
                () => window.open('https://github.com/luoxiaozero/ArtText'), "Github"
            
        );
    }
}

/**保存md文本*/
export let saveMdFile = {
    created: function (art: Art, options: any) {
        art.get<Toolbar>('toolbar').addButton('<svg style="fill: currentColor;width: 16px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M380.93 57.37A32 32 0 0 0 358.3 48H94.22A46.21 46.21 0 0 0 48 94.22v323.56A46.21 46.21 0 0 0 94.22 464h323.56A46.36 46.36 0 0 0 464 417.78V153.7a32 32 0 0 0-9.37-22.63zM256 416a64 64 0 1 1 64-64a63.92 63.92 0 0 1-64 64zm48-224H112a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16v64a16 16 0 0 1-16 16z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path></svg>',
 () => art.get<EventCenter>('$eventCenter').emit('art-save')
        , '保存');
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
            (abbrNames: any, renderName: any) => { 
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
            this.spanElement.title = this.abbrNames[index];
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

        switchRenderBotton.spanElement = art.get<Toolbar>('toolbar').addButton(
            '<svg style="fill: currentColor;width: 16px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1666"><path d="M128 522.666667c17.066667 0 32-14.933333 32-32v-170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h652.8l-83.2 83.2c-12.8 12.8-12.8 34.133333 0 46.933334 6.4 6.4 14.933333 10.666667 23.466666 10.666666s17.066667-4.266667 23.466667-10.666666l145.066667-145.066667c12.8-12.8 12.8-34.133333 0-46.933333l-145.066667-145.066667c-12.8-12.8-34.133333-12.8-46.933333 0-12.8 12.8-12.8 34.133333 0 46.933333l93.866666 93.866667H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666667v170.666666c0 19.2 14.933333 34.133333 32 34.133334zM906.666667 501.333333c-17.066667 0-32 14.933333-32 32v170.666667c0 6.4-4.266667 10.666667-10.666667 10.666667H211.2l83.2-83.2c12.8-12.8 12.8-34.133333 0-46.933334-12.8-12.8-34.133333-12.8-46.933333 0l-145.066667 145.066667c-12.8 12.8-12.8 34.133333 0 46.933333l145.066667 145.066667c6.4 6.4 14.933333 10.666667 23.466666 10.666667s17.066667-4.266667 23.466667-10.666667c12.8-12.8 12.8-34.133333 0-46.933333l-93.866667-93.866667h663.466667c40.533333 0 74.666667-34.133333 74.666667-74.666667v-170.666666c0-19.2-12.8-34.133333-32-34.133334z" p-id="1667"></path></svg>',
            () => switchRenderBotton.click(),
           switchRenderBotton.title
        );
    }
}