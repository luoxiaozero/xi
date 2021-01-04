import { Art, Core } from "@/core";
import Tool from "@/tool";
import Toolbar from "../toolbar";

/**侧边栏 */
export default class Sidebar {
    private art: Art;
    dom: HTMLDivElement;
    menuDom: HTMLDivElement;
    mainDom: HTMLDivElement;
    openOrCloseFlag: boolean;
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

        this.add('大纲', document.createElement('span'));
        this.add('文件', document.createElement('span'));
        this.art.get<Tool>('$tool').add([{ dom: this.dom, place: 'Editor.before' }]);
    }

    public add(menuText: string, mainDom: HTMLElement) {
        let span = document.createElement('span');
        span.setAttribute('class', 'art-sidebar-menu-span')
        span.innerHTML = menuText;
        this.menuDom.appendChild(span);

        let menuDomChild = document.createElement('span');
        menuDomChild.setAttribute('style', 'flex: 1');
        this.menuDom.appendChild(menuDomChild);
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
        options['Tool'].addCss('.art-sidebar{width:300px;margin-left: -333px;top: 30px;bottom: 20px;position: fixed;font-size:13.5px;background-color: #fff;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 3px;color: #666;} \
                                .art-sidebar-menu{display: flex;border-bottom: 1px #eee solid;font-weight: 600;padding: 15px 20px 10px;text-align:center;font-size: 14px}.art-sidebar-menu-span{border-bottom: 4px #666 solid;padding: 0 15px 5px;cursor: pointer;}')
    },
    created: (art: Art , options) => art.get<Sidebar>('sidebar')
}

export let openSidebar = {
    created:  (art: Art , options) => 
        art.get<Toolbar>('toolbar').add({
            title: '侧边栏', click: () => art.get<Sidebar>('sidebar').openOrClose()
        })
}