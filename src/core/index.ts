import { Config, RunModel } from '@/config';
import Toolbar from '@/pluginCenter/plugins/toolbar';
import ArtText from '../artText'
import Editor from '../editor'
import EventCenter from '../eventCenter';
import PluginCenter from '../pluginCenter';
import Tool from '../tool';


/**
 * 内核
 */
export default class Core {
    static core: Core = null;
    static artTextId: number = 0;
    static artTexts: ArtText[] = [];

    /**
     * 文件加载时, 执行的钩子
     */
    static loaded() {
        PluginCenter.loaded();
    }

    /**
     * art
     * @param artText 
     * @param mode 
     */
    static artText(artText: ArtText, mode: string): void {
        if (!Core.core)
            Core.core = new Core();
        if (mode == 'create')
            Core.core.registerArtText(artText);
        else if (mode == 'mount')
            Core.core.initArtText(artText);
        else if (mode == 'unmount')
            Core.core.unmountArtText(artText);
    }

    /**
     * 注册artText 
     */
    public registerArtText(artText: ArtText) {
        artText.nameId = 'artText-' + Core.artTextId++;

        artText.$tool = new Tool(artText);
        artText.$editor = new Editor(artText);
        artText.$eventCenter = new EventCenter(artText);
        artText.$pluginCenter = new PluginCenter(artText);
        artText.exportAPI('switchRunModel', (model: RunModel) => {this.switchRunModel(artText, model)});
    }

    /**
     * 
     */
    public initArtText(artText: ArtText): void {
        artText.$editor.init();
    }

    /**
     * 
     */
    public unmountArtText(artText: ArtText) {

    }

    /**
     * 切换运行模式
     * @param artText 
     * @param model 
     */
    public switchRunModel(artText: ArtText, model: RunModel) {
        let oldModel = artText.options.runModel;

        switch (model) {
            case RunModel.read_noStyle:
                artText.dom.childNodes.forEach((node) => {
                    (<HTMLElement>node).style.display = 'none';
                })
                artText.$editor.dom.style.display = 'inherit';
                artText.$editor.dom.setAttribute('class', 'art-editor-noStyle')
                
                artText.$editor.switchRender('ArtRender');
                break;
            case RunModel.editor:
                artText.dom.childNodes.forEach((node) => {
                    (<HTMLElement>node).style.display = 'inherit';
                })
                artText.$editor.dom.setAttribute('class', 'art-editor')
                artText.$editor.dom.childNodes.forEach((node) => {
                    (<HTMLElement>node).style.display = 'inherit';
                })
    
                artText.$editor.switchRender('ArtRender');
        }

        artText.options.runModel = model;
    }
}