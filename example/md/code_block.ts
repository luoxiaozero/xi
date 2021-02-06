

let md = function () {
      /* [TOC]
``` mermaid
graph LR
      A --- B
      B-->C[fa:fa-ban forbidden]
      B-->D(fa:fa-spinner);
```

```mermaid
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

``` flow
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台
st->op->cond
cond(yes)->e
cond(no)->op
```

## 2021 0201
~~~
def
~~~
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
