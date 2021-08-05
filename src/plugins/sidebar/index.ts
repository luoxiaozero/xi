import { Art, Core } from "../../core";
import Tool from "../../tool";
import Toolbar from "../toolbar";
import "./styles/index.css";

/**侧边栏 */
export default class Sidebar {
    private art: Art;
    dom: HTMLDivElement;
    menuDom: HTMLDivElement;
    selectMenuDom: HTMLSpanElement;
    mainDom: HTMLDivElement;
    openOrCloseFlag: boolean;
    info: Map<string, HTMLElement>;
    constructor(art: Art) {
        this.art = art;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-sidebar');
        this.openOrCloseFlag = true;

        this.menuDom = document.createElement('div');
        this.menuDom.setAttribute('class', 'art-sidebar-menu');
        this.dom.appendChild(this.menuDom);

        let menuDomChild = document.createElement('span');
        menuDomChild.setAttribute('style', 'flex: 1');
        this.menuDom.appendChild(menuDomChild);

        this.mainDom = document.createElement('div');
        this.mainDom.setAttribute('class', 'art-sidebar-main');
        this.dom.appendChild(this.mainDom);

        this.selectMenuDom = null;
        this.info = new Map();

        this.art.get<Tool>('$tool').add([{ dom: this.dom, place: 'Content.start' }]);
    }

    public add(menuText: string, mainDom: HTMLElement) {
        this.info.set(menuText, mainDom);
        let span = document.createElement('span');
        span.setAttribute('class', 'art-sidebar-menu-span')
        span.innerHTML = menuText;
        this.menuDom.appendChild(span);

        let menuDomChild = document.createElement('span');
        menuDomChild.setAttribute('style', 'flex: 1');
        this.menuDom.appendChild(menuDomChild);

        mainDom.style.display = 'none';
        this.mainDom.appendChild(mainDom);

        const _this = this;
        span.onclick = function()  {
            _this.openOption(this as HTMLSpanElement);
        }

        if(!this.selectMenuDom)
            span.click()
    }

    public openOption(span: HTMLSpanElement) {
        if (this.selectMenuDom) {
            this.selectMenuDom.classList.remove('art-sidebar-menu-select');
            this.info.get(this.selectMenuDom.innerHTML).style.display = 'none';
        }
        this.selectMenuDom = span;

        span.classList.add('art-sidebar-menu-select');
        this.info.get(this.selectMenuDom.innerHTML).style.display = 'inherit';
    }

    public openOrClose(): void {
        if (this.openOrCloseFlag) {
            this.dom.style.display = 'none';
        } else {
            this.dom.style.display = 'block';
        }
        this.openOrCloseFlag = !this.openOrCloseFlag;
    }
}

export let SidebarExport = {
    install: function (Art: any, options: any) {
        Core.use(openSidebar);
        options['container'].bind('sidebar', Sidebar, [{'get': 'art'}], true);
    },
    created: (art: Art , options: any) => art.get<Sidebar>('sidebar')
}

export let openSidebar = {
    created:  (art: Art , options: any) => 
        art.get<Toolbar>('toolbar').add({
            title: '侧边栏', click: () => art.get<Sidebar>('sidebar').openOrClose()
        })
}