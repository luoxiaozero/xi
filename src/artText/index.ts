import { ArtOptions, ART_DEFAULT_OPTIONS } from '../config'
import Core from '../core'
import Editor from '../editor';
import EventCenter from '../eventCenter';
import PluginCenter from '../pluginCenter';
import Tool from '../tool';

/**
 * 扩展插件的类
 */
class CorePlugin {
    $editor: Editor;
    $tool: Tool;
    $eventCenter: EventCenter;
    $pluginCenter: PluginCenter;
}

/**
 * 入口类
 */
export default class ArtText extends CorePlugin {
    static version: string = '0.1.0';
    /**插件的注入 */
    static use = PluginCenter.use;

    /**绑定的根节点 */
    rootContainer: HTMLElement;
    /**artText的根节点 */ 
    dom: HTMLDivElement;
    /**artText的名字 */
    nameId: string;
    /**artText的初始选项 */
    options:  ArtOptions;
    constructor(options = {}) {
        super();
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-main');
        this.options = Object.assign({}, ART_DEFAULT_OPTIONS, options);

        Core.artText(this, 'create');
    }

    /**
     * 挂载节点
     * @param rootContainer 节点的id属性
     */
    public mount(rootContainer: string): ArtText {
        this.rootContainer = document.querySelector(rootContainer);
        this.rootContainer.appendChild(this.dom);
        Core.artText(this, 'mount');
        return this;
    }

    /**
     * 插入插件
     * @param plugin 插件
     * @param options 插件配置
     */
    public use(plugin: any, options: {}) {
        this.$pluginCenter.use(plugin, options);
    }

    /**
     * 外抛API
     * @param key 
     * @param event 
     */
    public exportAPI(key: string, event: Function) {
        this[key] = event;
    }

    /**
     * 卸载 
     */
    public unmount() {
        Core.artText(this, 'unmount');
    }
}
