let md = function() {  
    /* [TOC]
* [ ] sdfsdf
* [x] asddsfdfs

* 无序列表
* * 给岁月以文明，
  * 而不是给文明以岁月。

  发士大夫十分
* * 无序列表
* * > dsaddfsf
    > dsfdsf
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