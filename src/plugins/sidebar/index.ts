import { Art, Core } from "../../core";
import Tool from "../../tool";
import Toolbar from "../toolbar";

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

        this.art.get<Tool>('$tool').add([{ dom: this.dom, place: 'Editor.before' }]);
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
            this.dom.style.display = 'inherit';
        }
        this.openOrCloseFlag = !this.openOrCloseFlag;
    }
}

export let SidebarExport = {
    install: function (Art, options) {
        Core.use(openSidebar);
        options['container'].bind('sidebar', Sidebar, [{'get': 'art'}], true);
        options['Tool'].addCss('.art-sidebar{width:300px;margin-left: -333px;top: 20px;bottom: 20px;position: fixed;font-size:13.5px;background-color: #fff;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 3px;color: #666;} \
                                .art-sidebar-menu{height: 28px;display: flex;border-bottom: 1px #eee solid;font-weight: 600;padding: 10px 20px 6px;text-align:center;font-size: 14px}.art-sidebar-menu-span{padding: 0 15px 5px;cursor: pointer;}\
                                .art-sidebar-menu-select{border-bottom: 4px #666 solid;}\
                                .art-sidebar-main{height: calc(100% - 50px);padding: 3px 0 4px}')
    },
    created: (art: Art , options) => art.get<Sidebar>('sidebar')
}

export let openSidebar = {
    created:  (art: Art , options) => 
        art.get<Toolbar>('toolbar').add({
            title: '侧边栏', click: () => art.get<Sidebar>('sidebar').openOrClose()
        })
}