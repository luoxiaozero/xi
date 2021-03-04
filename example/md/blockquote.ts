let md = function () {
    /* [TOC]
> 引用
> **引用**
> > 1. 引用
> > 2. 引用
> > > * 引用
> > > * 引用
> > > > 引用
> > > > 引用1234
> > > >
> > > > abcdef


1. dsfsdfs
2. > dsfdfsfsfd
   > dsdffsf
  */
}

let lines = new String(md);
lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
/**删除每行的最后一个字符(\n) */
let arr = lines.split('\n')
for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].substring(0, arr[i].length - 1)
}
lines = arr.join('\n');
export default lines;
