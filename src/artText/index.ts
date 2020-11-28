import { ArtOptions, ART_DEFAULT_OPTIONS } from '../config'
import { Art, Core } from '@/core'

/** 入口类 */
export default class ArtText extends Art {
    static version: string = '0.1.1';
    static use = Core.use;

    /**绑定的根节点 */
    rootContainer: HTMLElement;
    /**artText的根节点 */
    dom: HTMLDivElement;
    /**artText的名字 */
    nameId: string;
    /**artText的初始选项 */
    options: ArtOptions;
    constructor(options = {}) {
        super();
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-main');
        this.options = Object.assign({}, ART_DEFAULT_OPTIONS, options);

        Core.createdArt(this);
    }

    /**
     * 挂载节点
     * @param rootContainer 节点的id属性
     */
    public mount(rootId: string): ArtText {
        this.rootContainer = document.querySelector(rootId);
        this.rootContainer.appendChild(this.dom);

        Core.mountArt(this);
        return this;
    }

    /**
     * 外抛API
     * @param key 
     * @param event 
     */
    public exportAPI(key: string, event: Function) {
        this[key] = event;
    }

    /** 卸载 */
    public unmount() {
        Core.unmountArt(this);
    }
}

export let ArtTextExport = {
    install: function (Art, options) {
        window['ArtText'] = ArtText;
    }
}
