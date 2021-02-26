let md = function() {  
    /* [TOC]
1. sada
2. dsad
   sdfdsfsfsdf

* [x] 已完成
* [ ] 未完成
  > dsaddfsdfdsf


* 无序列表
* 无序列表
* * 给岁月以文明，而不是给文明以岁月。
* * 无序列表
* * * 无序列表
* * * 无序列表

#### 有序列表

1. 有序列表
2. 有序列表
3. * 无序列表
   * 无序列表
4. 有序列表
   > dsaddfsdfdsf
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