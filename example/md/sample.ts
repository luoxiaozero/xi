let md = function() {  
    /*
[TOC]

2020 0818

## markdown 编辑  [百度百科](https://baike.baidu.com/item/markdown/3245829?fr=aladdin)

Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。

Markdown具有一系列衍生版本，用于扩展Markdown的功能（如表格、脚注、内嵌HTML等等），这些功能原初的Markdown尚不具备，它们能让Markdown转换成更多的格式，例如LaTeX，Docbook。Markdown增强版中比较有名的有Markdown Extra、MultiMarkdown、 Maruku等。这些衍生版本要么基于工具，如Pandoc；要么基于网站，如GitHub和Wikipedia，在语法上基本兼容，但在一些语法和渲染效果上有改动。

## markdown 

Markdown is a markup language that can be written with a common text editor . Through simple markup syntax, it can make common text content have a certain format.

Markdown has a series of derivative versions to extend the functions of Markdown (such as tables, footnotes, embedded HTML, etc.). These functions are not available in the original Markdown. They can convert Markdown into more formats, such as LaTeX, Docbook . The more famous Markdown enhanced versions include Markdown Extra, MultiMarkdown, Maruku, etc. These derivative versions are either based on tools, such as Pandoc; or based on websites, such as GitHub and Wikipedia, which are basically compatible in syntax, but have some changes in syntax and rendering effects.

### 标题

标题能显示出文章的结构。行首插入1-6个#，每增加一个#表示更深入层次的内容，对应到标题的深度由1-6阶。

# H1 :# Header 1

## H2 :## Header 2

### H3 :### Header 3

#### H4 :#### Header 4

##### H5 :##### Header 5

###### H6 :###### Header 6

#### 字符效果

***粗斜体***  

**粗体** || __粗体__ 

*斜体字* || _斜体字_

#### 扩展字符效果

~~删除线~~

数学公式：$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$

#### 横线

***

#### html

<span style="color: #158bb8">html鸢尾蓝文字</span>

#### 链接 

[Title](URL)

#### 图片

![ad](imgs/tu--imgs.jpg)

#### 无序列表

* [x] 已完成
* [ ] 未完成


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

#### 引用

> 引用
> **引用**
> > 1. 引用
> > 2. 引用
> > > * 引用
> > > * 引用
> > > > 引用
> > > > 引用

#### 表格

|   水果      |   价格    |   数量   |
|   ---       |   ---     |   ---   |
|   香蕉      |   $1      |    5    |
|   苹果      |   $1      |    6    |
|   草莓      |   $1      |    7    |

***

| 123 | 456 | 789 |

#### 代码

`print("123")`

`alert('Hello World');`

```
import sys
def aa(x):
    return x
class bb:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        dir(self)
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

``` python
import sys
def aa(x):
    return x
class bb:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        dir(self)
```

```mermaid
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

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
