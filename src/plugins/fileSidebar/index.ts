import Editor from '../../editor';
import { Art } from '../../core';
import Sidebar from '../sidebar';
import ArtRequest from '../artRequest';

class FileSidebar {
    dom: HTMLDivElement;
    art: Art;
    file: any;
    openFolderDom: HTMLDivElement;
    folderDom: HTMLUListElement;
    selectDom: HTMLSpanElement;
    constructor(art: Art) {
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-fileSidebar')

        this.art = art;
        this.file = { path: '/src', files: [{ path: '/src/index.ts', name: 'index.ts', type: 'ts' }], name: 'src', type: '' };

        this.openFolderDom = document.createElement('div');
        this.openFolderDom.setAttribute('class', 'art-fileSidebar-openFolder')
        this.openFolderDom.innerHTML = '打开文件夹';
        this.openFolderDom.onclick = () => this.openFolder();
        this.dom.appendChild(this.openFolderDom);

        this.folderDom = document.createElement('ul');
        this.dom.appendChild(this.folderDom);
    }

    private openFolder() {
        const _this = this;
        this.art.get<ArtRequest>('artRequest').get('/openFolder').then((json: any) => {
            _this.file = json;
            _this.updata();
        })
    }

    public updata() {
        this.folderDom.innerHTML = '';
        let li = this.openFile(this.file);
        this.selectDom = li.childNodes[0] as HTMLSpanElement;
        this.selectDom.classList.add('art-fileSidebar-select');
        this.folderDom.appendChild(li);
    }

    public openFile(file: any): HTMLLIElement {
        const _this = this;

        let li = document.createElement('li');
        let span = document.createElement('span');
        span.setAttribute('art-path', file.path);
        span.setAttribute('art-fileSidebar-type', file.type);
        span.innerHTML = file.name;
        li.appendChild(span);

        if (file.type == 'folder') {
            let ul = document.createElement('ul');
            if (file.files)
                for (let f of file.files) 
                    ul.appendChild(this.openFile(f));
            li.appendChild(ul);
        } else {
            li.setAttribute('class', 'art-fileSidebar-file')
        }

        span.onclick = function () {
            _this.selectDom.classList.remove('art-fileSidebar-select');
            _this.selectDom = this as HTMLSpanElement;
            _this.selectDom.classList.add('art-fileSidebar-select');
            let path = _this.selectDom.getAttribute('art-path');
            let type = _this.selectDom.getAttribute('art-fileSidebar-type');
            if (type == 'folder') {
                _this.art.get<ArtRequest>('artRequest').get('/openFolder?path=' + path).then((json: any) => {
                    (this as HTMLSpanElement).parentElement.parentElement.replaceChild(
                        _this.openFile(json), (this as HTMLSpanElement).parentElement)
                })
            } else {
                _this.art.get<ArtRequest>('artRequest').get('/openFileText?path=' + path).then((json: any) => {
                    console.log(json)
                    _this.art.get<Editor>('$editor').openFile(json);
                })
            }
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
            .art-fileSidebar::-webkit-scrollbar-thumb {background: #ccc;}.art-fileSidebar-select{font-weight: bolder;}')
    },
    created: (art: Art) => {
        art.get<Sidebar>('sidebar').add('文件', art.get<FileSidebar>('fileSidebar').dom);
    }
}