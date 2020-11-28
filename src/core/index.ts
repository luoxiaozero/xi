// import { Config, RunModel } from '@/config';
// import Toolbar from '@/pluginCenter/plugins/toolbar';
// import ArtText from '../artText'
// import Editor from '../editor'
// import EventCenter from '../eventCenter';
// import PluginCenter from '../pluginCenter';
// import Tool from '../tool';
import Art from './Art';
import Core from './Core';

export { Core , Art};
/**
 * 内核
 */
// export default class Core {
//     static core: Core = null;
//     static artTextId: number = 0;
//     static artTexts: ArtText[] = [];

//     /**
//      * 文件加载时, 执行的钩子
//      */
//     public static loaded() {
//         PluginCenter.loaded();
//     }

//     /**
//      * 注册artText 
//      */
//     public static registerArtText(artText: ArtText): void {
//         artText.nameId = 'artText-' + Core.artTextId++;

//         artText.$tool = new Tool(artText);
//         artText.$editor = new Editor(artText);
//         artText.$eventCenter = new EventCenter(artText);
//         artText.$pluginCenter = new PluginCenter(artText);
//         artText.exportAPI('switchRunModel', (model: RunModel) => { Core.switchRunModel(artText, model) });

//         Core.artTexts.push(artText);
//     }

//     /**
//      * 初始化artText 
//      */
//     public static initArtText(artText: ArtText): void {
//         artText.$editor.init();
//     }

//     /**
//      * 卸载artText 
//      */
//     public static unmountArtText(artText: ArtText) {

//     }

//     /**
//      * 切换运行模式
//      * @param artText 
//      * @param model 
//      */
//     private static switchRunModel(artText: ArtText, model: RunModel) {
//         let className;

//         switch (model) {
//             case RunModel.read_noStyle:
//                 artText.dom.childNodes.forEach((node) => {
//                     (<HTMLElement>node).style.display = 'none';
//                 })
//                 artText.$editor.dom.style.display = 'inherit';
//                 className = artText.$editor.dom.getAttribute('class');
//                 className = className.replace('art-editor', 'art-editor-noStyle');
//                 artText.$editor.dom.setAttribute('class', className);

//                 artText.$editor.switchRender('ArtRender');
//                 artText.$editor.runRender.detachAllEvent();
//                 console.log(artText.$eventCenter)
//                 break;
//             case RunModel.editor:
//                 artText.dom.childNodes.forEach((node) => {
//                     (<HTMLElement>node).style.display = 'inherit';
//                 })
//                 className = artText.$editor.dom.getAttribute('class');
//                 className = className.replace('art-editor-noStyle', 'art-editor');
//                 artText.$editor.dom.setAttribute('class', className);
//                 artText.$editor.dom.childNodes.forEach((node) => {
//                     (<HTMLElement>node).style.display = 'inherit';
//                 })

//                 artText.$editor.switchRender('ArtRender');
//                 artText.$editor.runRender.attachAllEvent();
//         }

//         artText.options.runModel = model;
//     }
// }

