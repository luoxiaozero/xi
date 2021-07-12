import { Art } from "../../core";
/**侧边栏 */
export default class Sidebar {
    private art;
    dom: HTMLDivElement;
    menuDom: HTMLDivElement;
    selectMenuDom: HTMLSpanElement;
    mainDom: HTMLDivElement;
    openOrCloseFlag: boolean;
    info: Map<string, HTMLElement>;
    constructor(art: Art);
    add(menuText: string, mainDom: HTMLElement): void;
    openOption(span: HTMLSpanElement): void;
    openOrClose(): void;
}
export declare let SidebarExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => Sidebar;
};
export declare let openSidebar: {
    created: (art: Art, options: any) => HTMLSpanElement;
};
