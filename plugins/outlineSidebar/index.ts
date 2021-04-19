import { Art } from "@/core";
import EventCenter from "@/eventCenter";
import Sidebar from "@/../plugins/sidebar";
import ArtRender from "@/renders/artRender";
import VNode from "@/node";

class OutlineSidebar {
    dom: HTMLDivElement;
    art: Art;
    constructor(art: Art) {
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-outlineSidebar')

        this.art = art;
        const _this = this;
        art.get<EventCenter>('$eventCenter').on('artRender-render', () => _this.updataToc());

    }

    public updataToc() {
        this.dom.innerHTML = '';
        let node = this.art.get<ArtRender>('$artRender').doc.firstChild;
        while (node) {
            if (node.type === "heading") {
                let md = node.getMd();
                md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
                let p = document.createElement('p');
                p.setAttribute('class', 'art-outlineSidebar-h' + node._level);
                let a = document.createElement('a');
                a.href = '#' + md;
                a.innerHTML = node.getText();
                p.appendChild(a);
                this.dom.appendChild(p);
            }
            node = node.next;
        }
    }
}

export let OutlineSidebarExport = {
    install: (Art, options) => {
        options['container'].bind('outlineSidebar', OutlineSidebar, [{ 'get': 'art' }], true);
        options['Tool'].addCss('.art-outlineSidebar{height: 100%;overflow: auto;}\
        .art-outlineSidebar-h1{padding-left: 0.6em;}.art-outlineSidebar-h2{padding-left: 1em;}.art-outlineSidebar-h3{padding-left: 2em;}\
        .art-outlineSidebar-h4{padding-left: 3em;;}.art-outlineSidebar-h5{padding-left: 4em;;}.art-outlineSidebar-h6{padding-left: 5em;}\
            .art-outlineSidebar p{margin:0; font-size: 12px;padding-right:5px;}.art-outlineSidebar p:hover{background-color: #eee;}\
            .art-outlineSidebar a{color: inherit;;text-decoration: none;width: 100%;display: block;padding: 8px 0}    \
            .art-outlineSidebar::-webkit-scrollbar {width: 10px;height:0}\
            .art-outlineSidebar::-webkit-scrollbar-thumb {background: #ccc;}\
            ')
    },
    created: (art: Art) => {
        art.get<Sidebar>('sidebar').add('大纲', art.get<OutlineSidebar>('outlineSidebar').dom);
    }
}