import ArtText from '../src'
import './imgs/tu.jpg'
import sample from './md/sample'
import table from './md/table'
import code_block from "./md/code_block"
import list from "./md/list";
import blockquote from "./md/blockquote";

let defaultMd = sample as string;

window.onload = function () {
    let time = new Date();
    const art: ArtText = new ArtText({ defaultMd: defaultMd, toolbar: [{title: "Test"}] });
    art.mount('#art');
    let time_end = new Date();
    console.log("初始化时间: " ,  time_end.getTime() - time.getTime())
    window['art'] = art;

    setTimeout(
       () =>  art["setFile"]({defaultMd: "Hello"})
    , 4000)
}