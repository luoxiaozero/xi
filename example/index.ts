import ArtText from '../src'
import './imgs/tu.jpg'
import sample from './md/sample'
import table from './md/table'

let defaultMd = sample;

window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: defaultMd }).mount('#art');
    window['art'] = art;
}