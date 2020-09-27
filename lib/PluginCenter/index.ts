import ArtText from 'lib';
import { exportMdFile, importMdFile, newMdFile, Github } from './default';
import VersionHistory from './versionHistory';

export interface _Object_ {
    openFile: Function;
    getFile: Function;
    pluginChilds: any[];
    parentPlugin: any;
}

export default class PluginCenter {
    static Plugins: {} = { importMdFile, exportMdFile, VersionHistory, newMdFile, Github };
    static corePlugins: any[] = [];
    static use(plugin: any): void {
        let codeName = plugin.name;
        if (plugin.codeName)
            codeName = codeName;

        PluginCenter.Plugins[codeName] = plugin;
    }

    artText: ArtText;
    registerPlugins: any[];
    _object_: _Object_; // 插件通过该变量访问信息
    constructor(artText: ArtText) {
        this.artText = artText;
        this.registerPlugins = [];

        this._object_ = {
            openFile: (...args) => { return artText.editor.openFile(args[0], args[1]); },
            getFile: (key = null) => { return artText.editor.getFile(key); },
            pluginChilds: [],
            parentPlugin: null
        }
    }

    public register(): void {
        for (let key in PluginCenter.Plugins) {
            this.registerPlugin(PluginCenter.Plugins[key]);
        }
    }

    private registerPlugin(Plugin) {
        let codeDescribe = Plugin.codeDescribe;
        let plugin;
        switch (codeDescribe) {
            case 'Toolbar.add':
                let artText = this.artText;
                plugin = new Plugin(this._object_);
                if (plugin.addDefaultClass != undefined) {
                    artText.tool.toolbar.addTool(plugin.text, () => { plugin.click(); }, plugin.addDefaultClass);
                } else {
                    artText.tool.toolbar.addTool(plugin.text, () => { plugin.click(); });
                }

                this.registerPlugins.push(plugin);
                break;
            case 'Tool.add':
                plugin = new Plugin(this._object_);
                plugin._object_.pluginChilds = this.registerPluginChild(Plugin, plugin);

                let nodes = plugin.getRootDomChilds();
                for (let node of nodes)
                    this.artText.rootDom.appendChild(node);

                this.registerPlugins.push(plugin);
                break;
        }
        return plugin;
    }

    private registerPluginChild(Plugin, parentPlugin = null): any[] {
        if (!Plugin.Plugins)
            return null;
        let pluginChild = []

        let p;
        for (let key in Plugin.Plugins) {
            if (p = this.registerPlugin(Plugin.Plugins[key])) {
                p._object_.parentPlugin = parentPlugin;
                pluginChild.push(p);
            }

        }
        return pluginChild;
    }
}

