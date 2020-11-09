import ArtRender from "@/renders/artRender";
import Cursor from "@/renders/artRender/cursor";
import { initCodeTool, initTableTool, initTocTool } from "@/renders/artRender/tool";
import Tool from "@/tool";
import { VNode, VText } from "../../vObject";

/**
 * 虚拟节点渲染到节点上
 * @param dom 节点
 * @param vnode 虚拟节点
 */
export default function vnodeRender(dom: HTMLElement, vnode: VNode) {
    if (dom.nodeName.toLowerCase() == vnode.nodeName) {
        if (vnode.nodeName == "code") {
            if (dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                dom.setAttribute('style', '');
            for (let key in vnode.attr) {
                if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                    dom.setAttribute(key, vnode.attr[key]);
                }
            }
            let md = vnode.getMd();
            if (ArtRender.plugins.hljs && vnode.parentNode.nodeName == 'pre') {
                let className: string = vnode.attr['class'];
                if (!className) {
                    className = '';
                }
                let lang = className.match(/lang-(.*?)(\s|$)/);
                if (lang && ArtRender.plugins.hljs.getLanguage(lang[1]) != undefined) {
                    md = ArtRender.plugins.hljs.highlight(lang[1], md).value;
                } else {
                    let code = ArtRender.plugins.hljs.highlightAuto(md);
                    md = code.value;
                    if (!dom.className.match(code.language))
                        dom.className += ' ' + code.language;
                }
            }
            dom.innerHTML = md;
            return null
        } else if (Tool.hasClass(dom, "art-shield")) {
            let styleClean = true;
            if (vnode.hasClass('art-flowTool') && ArtRender.plugins.flowchart && ArtRender.plugins.Raphael) {
                dom.innerHTML = ''
                let md = (<HTMLPreElement>dom.previousSibling).innerText;
                try {
                    let chart = ArtRender.plugins.flowchart.parse(md);
                    chart.drawSVG(dom);
                    (<HTMLPreElement>dom.previousSibling).style.display = 'none';
                    dom.onclick = function click() {
                        if (Tool.hasClass(this as HTMLDivElement, "art-flowTool")) {
                            (<HTMLPreElement>(<HTMLDivElement>this).previousSibling).style.display = 'inherit';
                        }
                        Cursor.setCursor((<HTMLPreElement>(<HTMLDivElement>this).previousSibling), 0);
                    }
                } catch (error) {
                    console.error('flowchart发生错误')
                    console.error(error);
                }
            } else if (vnode.attr['__dom__'] == 'math' && ArtRender.plugins.katex) {
                let math = (<HTMLElement>dom.childNodes[0]).getAttribute("art-math")
                if (math && (<VNode>vnode.childNodes[0]).attr["art-math"] != math) {
                    (<HTMLElement>dom.childNodes[0]).innerHTML = ArtRender.plugins.katex.renderToString((<VNode>vnode.childNodes[0]).attr["art-math"], { throwOnError: false });
                    (<HTMLElement>dom.childNodes[0]).setAttribute("art-math", (<VNode>vnode.childNodes[0]).attr["art-math"]);
                }
            } else if (vnode.attr['__dom__'] == 'tocTool') {
                initTocTool(dom);
                styleClean = false;
            } else if (vnode.attr['__dom__'] == 'codeTool') {
                initCodeTool(dom, vnode.attr['__dict__']['codeLang']);
                styleClean = false;
            } else if (vnode.attr['__dom__'] == 'tableTool') {
                initTableTool(dom);
                styleClean = false;
            } else if (Tool.hasClass(dom, "art-toc")) {
                for (let i = 0, j = 0; i < dom.childNodes.length || j < vnode.childNodes.length; i++, j++) {
                    if (i >= dom.childNodes.length) {
                        dom.appendChild(vnode.childNodes[j].newDom());
                    } else if (j >= vnode.childNodes.length) {
                        let len = dom.childNodes.length;
                        while (i < len) {
                            dom.removeChild(dom.lastChild);
                            i++;
                        }
                    } else {
                        vnodeRender(<HTMLElement>dom.childNodes[i], <VNode>vnode.childNodes[j])
                    }
                }
            }
            if (styleClean && dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                dom.setAttribute('style', '');
            for (let key in vnode.attr) {
                if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                    dom.setAttribute(key, vnode.attr[key]);
                }
            }
        } else {
            if (dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                dom.setAttribute('style', '');
            for (let key in vnode.attr) {
                if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                    dom.setAttribute(key, vnode.attr[key]);
                }
            }
            for (let i = 0, j = 0; i < dom.childNodes.length || j < vnode.childNodes.length; i++, j++) {
                if (i >= dom.childNodes.length) {
                    dom.appendChild(vnode.childNodes[j].newDom());
                } else if (j >= vnode.childNodes.length) {
                    let len = dom.childNodes.length;
                    while (i < len) {
                        dom.removeChild(dom.lastChild);
                        i++;
                    }
                } else {
                    if (vnode.childNodes[j].nodeName == "#text") {
                        if (dom.childNodes[i].nodeName.toLowerCase() == "#text") {
                            if ((<VText>vnode.childNodes[j]).text != dom.childNodes[i].nodeValue) {
                                dom.childNodes[i].nodeValue = (<VText>vnode.childNodes[j]).text;
                            }
                        } else {
                            dom.replaceChild(vnode.childNodes[j].newDom(), dom.childNodes[i]);
                        }
                    } else {
                        vnodeRender(dom.childNodes[i] as HTMLElement, <VNode>vnode.childNodes[j]);
                    }

                }
            }
        }
    } else {
        dom.parentNode.replaceChild(vnode.newDom(), dom);
    }
    return null;
}
