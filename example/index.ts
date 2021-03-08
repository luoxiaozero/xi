import ArtText from '../src'
import './imgs/tu.jpg'
import sample from './md/sample'
import table from './md/table'
import code_block from "./md/code_block"
import list from "./md/list";
import blockquote from "./md/blockquote";

let defaultMd = blockquote;

window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: defaultMd }).mount('#art');
    window['art'] = art;
}