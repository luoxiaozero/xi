import ArtText from '../src'
import './imgs/tu.jpg'

let md = '\
* 无序列表3\n\
  * 无序列表4\n\
  * 无序列表5\n\
\n\
* 无序列表1\n\
* * 给岁月以文明，而不是给文明以岁月。2\n\
  * 无序列表3\n\
\n\
* 无序列表1\n\
* * 给岁月以文明，而不是给文明以岁月。2\n\
* * 无序列表3\n\
\n'

window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: md }).mount('#art');
    window['art'] = art;
}