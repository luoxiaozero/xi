import Editor from '@/editor';
import Tool from '@/tool';
import ArtText from '../artText';
import Message from "./plugins/message";
import Toolbar from "./plugins/toolbar";
import { ExportMdFile, Github, ImportMdFile, NewMdFile } from "./plugins/toolbar/default";
import VersionHistory from './plugins/versionHistory';

export interface _Object_ {
    openFile: (fileInfo?: {}, renderName?: string) => void;
    getFile: (key?: string) => any ;
    pluginChilds: any[];
    parentPlugin: any;
    emit: (type: string, ...data) => boolean;
}

export default class PluginCenter {
    static plugins: {} = {};
    static DEFAULT_CSS: string = '';

    /**
     * 应用ArtText插件
     * @param plugin 
     * @param options 
     */
    static use(plugin: any, options: {} = {}) {
        PluginCenter.plugins[plugin.Name] = { plugin, options };
    }

    /**
     * 文件加载完成时
     */
    static loaded() {
        PluginCenter.use(Toolbar);
        PluginCenter.use(Message);

        PluginCenter.use(ExportMdFile);
        PluginCenter.use(ImportMdFile);
        PluginCenter.use(NewMdFile);
        PluginCenter.use(Github);

        PluginCenter.use(VersionHistory);
    }

    artText: ArtText;
    /**保存artText插件 */
    plugins: {};
    /**注册过的插件 */
    registeredPlugins: {};
    /**插件可访问的信息 */
    _object_: _Object_;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.registeredPlugins = {};
        let _this = this;
        this._object_ = {
            openFile: (...args) => { return artText.get<Editor>('$editor').openFile(args[0], args[1]); },
            getFile: (key = null) => { return artText.get<Editor>('$editor').getFile(key); },
            emit: (type: string, ...data) => { return _this.emit(type, ...data) },
            pluginChilds: [],
            parentPlugin: null,

        }

        for (let key in PluginCenter.plugins) {
            this.registerPlugin(PluginCenter.plugins[key]);
        }

        Tool.addCss(PluginCenter.DEFAULT_CSS);
        PluginCenter.DEFAULT_CSS = '';
    }

    /**用于插件之间的通信 */
    public emit(type: string, ...data): any {
        try {
            let str = type.split('.');
            let plugin = this.registeredPlugins[str[0]];
            if (plugin) {
                return plugin[str[1]](...data);
            }
            return true;
        } catch (error) {
            console.error('插件通信提交失败:\n', error);
            return false;
        }
    }

    /**
     * 应用artText实例插件
     * @param plugin 插件
     * @param options 选项
     */
    public use(plugin: any, options: {} = {}) {
        this.plugins[plugin.name] = { plugin, options };
    }

    /**
     * 初始化
     */
    public init(): void {
        PluginCenter.DEFAULT_CSS = '';

        for (let key in this.plugins) {
            this.registerPlugin(this.plugins[key]);
        }

        Tool.addCss(PluginCenter.DEFAULT_CSS);
        PluginCenter.DEFAULT_CSS = '';
    }

    /**
     * 注册插件
     * @param PluginInfo 插件信息 
     */
    private registerPlugin(PluginInfo: any): any {
        let { plugin, options } = PluginInfo;
        let Plugin = plugin;
        try {
            let _object_: _Object_ = Object.assign(this._object_, options);
            let plugin = new Plugin(_object_);
            this.registeredPlugins[Plugin.Name] = plugin;
            if (plugin.createDoms) {
                let nodes: [] = plugin.createDoms();
                this.artText.get<Tool>('$tool').add(nodes);
            }
            if (Plugin.DEFAULT_CSS != undefined && Plugin.DEFAULT_CSS) {
                PluginCenter.DEFAULT_CSS += Plugin.DEFAULT_CSS;
            }
            if (Plugin.plugins != undefined) {
                let p: any;
                _object_.pluginChilds = [];
                for (let key in Plugin.plugins) {
                    if (p = this.registerPlugin(Plugin.plugins[key])) {
                        p._object_.parentPlugin = plugin;
                        _object_.pluginChilds.push(p);
                    }
                }

            }
            return plugin;
        } catch (error) {
            console.error(Plugin.name + "注册失败:\n", error);
        }
        return null;
    }

    /**
     * 注册插件的子插件
     * @param Plugin 插件
     * @param parentPlugin 插件的父亲 
     */
    private registerPluginChild(Plugin: any, parentPlugin: any = null): any[] {
        if (Plugin.plugins != undefined)
            return null;
        let pluginChild = []

        let p;
        for (let key in Plugin.plugins) {
            if (p = this.registerPlugin(Plugin.Plugins[key])) {
                p._object_.parentPlugin = parentPlugin;
                pluginChild.push(p);
            }

        }
        return pluginChild;
    }
}


export let PluginCenterExport = {
    install: function (Art, options) {
        // options['container'].bind('$tool', Tool, null);
    },
    created: function (art , options) {
        art.set('$pluginCenter', new PluginCenter(art));
    }
}