import { Art, Core } from "../../core";
import Tool from "../../tool";
import StatusBar from "../statusBar";
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

        this.art.get<Tool>('$tool').add([{ dom: this.dom, place: 'Main.start' }]);
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

    /**
     * 改变侧边栏状态
     * @returns true 打开 false 关闭
     */
    public openOrClose(): boolean {
        if (this.openOrCloseFlag) {
            this.dom.style.display = 'none';
        } else {
            this.dom.style.display = 'block';
        }
        this.openOrCloseFlag = !this.openOrCloseFlag;
        return this.openOrCloseFlag;
    }
}

export let SidebarExport = {
    install: function (Art: any, options: any) {
        options['container'].bind('sidebar', Sidebar, [{'get': 'art'}], true);
    },
    created: (art: Art , options: any) => {
        const chevronBackOutlineSvg = '<svg style="width:18px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"></path></svg>';
        art.get<Sidebar>('sidebar');
        const dom = document.createElement("span");
        dom.title = "关闭侧边栏";
        dom.style.display = "flex";
        dom.innerHTML = chevronBackOutlineSvg;
        art.get<StatusBar>("statusBar").addButton({"dom": dom,
            float: "left",
            onClick: () => {
                const status = art.get<Sidebar>('sidebar').openOrClose();
                dom.style.transform = status ? "none": "rotate(180deg)"
                dom.title = status ? "关闭侧边栏" : "打开侧边栏";
            }
        })
    }
}
