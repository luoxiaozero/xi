import { Art } from '../../src/core';
import Sidebar from '../../src/plugins/sidebar';

class FileSidebar {
    dom: HTMLDivElement;
    art: Art;
    file: any;
    openFolderDom: HTMLDivElement;
    constructor(art: Art) {
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-fileSidebar')

        this.art = art;
        this.file = { path: '/src' , files: [{path: '/src/index.ts', name: 'index.ts', type: 'ts'}], name: 'src', type: ''};

        this.openFolderDom = document.createElement('div');
        this.openFolderDom.setAttribute('class', 'art-fileSidebar-openFolder')
        this.openFolderDom.innerHTML = '打开文件夹';
        this.dom.appendChild(this.openFolderDom);
        this.updata();
    }

    public updata() {
        let ul = document.createElement('ul');
        ul.appendChild(this.openFile(this.file));
        this.dom.appendChild(ul);
    }

    public openFile(file: any): HTMLLIElement {
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.innerHTML = file.name;
        li.appendChild(span);

        if (file.type == '') {
            let ul = document.createElement('ul');
            for (let f of file.files) {
                ul.appendChild(this.openFile(f));
            }
            li.appendChild(ul);
        } else {
            li.setAttribute('class', 'art-fileSidebar-file')
        }
        return li;
    }
}

export let FileSidebarExport = {
    install: (Art, options) => {
        options['container'].bind('fileSidebar', FileSidebar, [{ 'get': 'art' }], true);
        options['Tool'].addCss('.art-fileSidebar-file{list-style: none;margin-left: -18px;}.art-fileSidebar{padding: 0 10px;height: 100%;overflow: auto;}.art-fileSidebar-openFolder{text-align: center;margin: 1em 30px 0.6em;padding: 6px;cursor: pointer;background: #1abc9c;color: #fff;font-weight: 600;}.art-fileSidebar-openFolder:hover{background: #1abc9ce0;}\
        .art-fileSidebar ul{margin: 0; padding-left: 18px}.art-fileSidebar li{margin-top: 5px;}.art-fileSidebar span{width: calc(100% - 6px);;display: inline-block;cursor: pointer;padding: 2px 0 2px 6px}.art-fileSidebar span:hover{background-color: #eee}\
        .art-fileSidebar::-webkit-scrollbar {width: 10px;height:0}\
            .art-fileSidebar::-webkit-scrollbar-thumb {background: #ccc;}')
    },
    created: (art: Art) => {
        art.get<Sidebar>('sidebar').add('文件', art.get<FileSidebar>('fileSidebar').dom);
    }
}