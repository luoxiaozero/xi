import ArtText from '../src'
import './imgs/tu.jpg'
import sample from './md/sample'
import table from './md/table'
import code_block from "./md/code_block"
import list from "./md/list";
import blockquote from "./md/blockquote";

let defaultMd = "\n\
123434\n\
\n\
dsfsdf\n\
\n\
sdfsssss![I][1]\n\
\n\
[12]: https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2037944103,1592597017&fm=26&gp=0.jpg\n\
\n\
";

window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: defaultMd }).mount('#art');
    window['art'] = art;
}