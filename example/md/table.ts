let md = function() {  
    /* [TOC]
1. sada
2. dsad

|   水果      |   价格    |   数量   |
|   :---:       |   ---     |   ---   |
|   香蕉      |   $1      |    5    |
|   苹果      |   $1      |    6    |
|   草莓      |   $1      |    7    |

***

| 123 | 456 | 789 |

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
