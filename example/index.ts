import ArtText from '../src'
import './imgs/tu.jpg'

'\n\
1. 无序列表3\n\
   2. 无序列表4\n\
   3. 无序列表5\n\
\n\
1234\n\
'


'1. 无序列表3\n\
  * 无序列表4\n\
  * 无序列表5\n\
    * 无序列表6\n\
    * * 无序列表6\n\
'

'1. 无序列表1\n\
2. 1. 给岁月以文明，而不是给文明以岁月。2\n\
   2. 无序列表3\n\
'

'1. 有序列表1\n\
2. 有序列表2\n\
   * 无序列表\n\
   * 无序列表2\n\
3. 有序列表3\n\
'
let md =
'\n\
* [x] 已完成\n\
* [ ] 未完成\n\
#### 引用\n\
\n\
> 引用\n\
> > 1. 引用\n\
> > 2. 引用\n\
> > > * 引用\n\
> > > * 引用\n\
'
window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: md }).mount('#art');
    window['art'] = art;
}