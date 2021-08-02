import { ArtOptions, ART_DEFAULT_OPTIONS } from '../config'
import { Art, Core } from '../core'
import "./styles/index.css"

/** 入口类 */
export default class ArtText extends Art {
    static readonly version: string = typeof process.env.ART_VERSION === 'undefined' ? 'dev' : process.env.ART_VERSION;
    static use = Core.use;

    /**绑定的根节点 */
    rootContainer: HTMLElement;
    /**artText的根节点 */
    dom: HTMLDivElement;
    domContent: HTMLDivElement;
    /**artText的名字 */
    nameId: string;
    /**artText的初始选项 */
    options: ArtOptions;
    constructor(options: ArtOptions = Object()) {
        super();
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-main');
        this.domContent = document.createElement('div');
        this.domContent.setAttribute('class', 'art-main__content');
        this.dom.appendChild(this.domContent);
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
