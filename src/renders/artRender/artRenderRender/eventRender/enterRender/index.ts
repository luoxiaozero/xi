import Cursor from "@/renders/artRender/cursor";
import { initCodeTool, initTableTool, initTocTool } from "@/renders/artRender/tool";
import ArtRenderRender from "../..";
import { domToNode } from "../../grammer";
import { updateToc } from "../../vnodeDispose";
import { VNode } from "../../vObject";


/**
 * 回车渲染
 */
export default function enterRender(artRenderRender: ArtRenderRender): boolean {
    let location = artRenderRender.artRender.cursor.location;
    let { anchorNode, anchorOffset } = artRenderRender.artRender.cursor.location;
    console.log('enter')
    if (location) {
        artRenderRender.rootNode.replaceAllChild((domToNode(artRenderRender.rootNode.dom) as VNode).childNodes);

        let md = artRenderRender.rootNode.childNodes[location.anchorAlineOffset].getMd();
        let dom = artRenderRender.rootNode.dom.childNodes[location.anchorAlineOffset];
        if (/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)) {
            let hr = document.createElement('hr');
            artRenderRender.rootNode.dom.replaceChild(hr, dom);
            Cursor.setCursor(hr, 0);
            return false;
        } else if (/^\[(TOC)|(toc)\]$/.test(md)) {
            // @future vnodes.push(new VNode('div', {class: 'art-shield art-tocTool', contenteditable: 'false', __dom__: 'tocTool'}));
            // @future vnodes.push(new VNode('div', {class: 'art-shield art-toc', contenteditable: 'false', __dom__: 'toc'}));
            let toc = document.createElement('div');
            toc.setAttribute('class', 'art-shield art-toc');
            toc.setAttribute('contenteditable', 'false');

            let tocTool = document.createElement('div');
            tocTool.setAttribute('class', 'art-shield art-tocTool');
            tocTool.setAttribute('contenteditable', 'false')
            initTocTool(tocTool);

            let p = document.createElement('p');
            p.innerHTML = '<br/>';
            if (dom.nextSibling)
                dom.parentNode.insertBefore(p, dom.nextSibling);
            else
                dom.parentNode.appendChild(p);

            artRenderRender.rootNode.dom.replaceChild(toc, dom);
            artRenderRender.rootNode.dom.insertBefore(tocTool, toc);
            updateToc(artRenderRender.rootNode);
            Cursor.setCursor(p, 0);
            return false;
        } else if (/^\|.*\|/.test(md)) {
            // 生成table
            let table = document.createElement('table');
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');
            table.appendChild(thead);
            table.appendChild(tbody);
            table.style.width = '100%';
            let tr1 = document.createElement('tr');
            let tr2 = document.createElement('tr');
            let arry = md.split('|');
            for (let i = 1, len = arry.length - 1; i < len; i++) {
                let th = document.createElement('th');
                th.innerHTML = arry[i];
                tr1.appendChild(th)
                tr2.appendChild(document.createElement('td'))
            }
            thead.appendChild(tr1);
            tbody.appendChild(tr2);

            let tool = document.createElement('div');
            tool.setAttribute('class', 'art-shield art-tableTool');
            tool.setAttribute('contenteditable', 'false')
            initTableTool(tool);

            artRenderRender.rootNode.dom.replaceChild(table, artRenderRender.rootNode.dom.childNodes[location.anchorAlineOffset]);
            artRenderRender.rootNode.dom.insertBefore(tool, table);
            Cursor.setCursor(tr2.childNodes[0], 0);
            return false;
        } else if (/^```/.test(md)) {
            // 生成code
            let pre = document.createElement('pre');
            let code = document.createElement('code');
            code.innerHTML = '\n';
            let lang = md.match(/^```\s*([^\s]*?)\s*$/)[1];

            let tool = document.createElement('div');
            tool.setAttribute('class', 'art-shield art-codeTool');
            tool.setAttribute('contenteditable', 'false')

            if (lang != undefined && lang != '') {
                code.setAttribute('class', 'lang-' + lang);
                pre.setAttribute('class', 'art-pre-' + lang)
                if (lang == 'flow') {
                    let div = document.createElement('div')
                    div.setAttribute('class', 'art-shield art-flowTool');
                    div.setAttribute('art-flow', '')
                    div.setAttribute('contenteditable', 'false');
                    artRenderRender.rootNode.dom.insertBefore(div, artRenderRender.rootNode.dom.childNodes[location.anchorAlineOffset].nextSibling);
                }
                initCodeTool(tool, lang);
            } else {
                initCodeTool(tool);
            }

            pre.appendChild(code);

            artRenderRender.rootNode.dom.replaceChild(pre, artRenderRender.rootNode.dom.childNodes[location.anchorAlineOffset]);
            artRenderRender.rootNode.dom.insertBefore(tool, pre);
            Cursor.setCursor(code, 0);
            return false;
        } else if (anchorNode.parentNode.nodeName == 'BLOCKQUOTE' && anchorOffset == 0 && anchorNode.nodeName == 'P'
            && anchorNode.childNodes.length == 1 && anchorNode.childNodes[0].nodeName == 'BR') {
            // blockquote 退出
            let p = document.createElement('p');
            p.innerHTML = '<br/>';

            if (anchorNode.parentNode.nextSibling)
                anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
            else
                anchorNode.parentNode.parentNode.appendChild(p);
            anchorNode.parentNode.removeChild(anchorNode);

            Cursor.setCursor(p, 0);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else if (anchorNode.parentNode.parentNode.nodeName == 'BLOCKQUOTE' && anchorNode.nextSibling == null
            && anchorOffset == (<Text>anchorNode).length) {
            // ul ol中的blockquote添加新行
            let p = document.createElement('p');
            p.innerHTML = '<br/>';

            if (anchorNode.parentNode.nextSibling)
                anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
            else
                anchorNode.parentNode.parentNode.appendChild(p);

            Cursor.setCursor(p, 0);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else if (anchorOffset == 0 && anchorNode.nodeName == 'LI' && anchorNode.childNodes.length == 1
            && anchorNode.childNodes[0].nodeName == 'BR') {
            // li 退回到root
            let p = document.createElement('p');
            p.innerHTML = '<br/>';

            if (anchorNode.parentNode.nextSibling)
                anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
            else
                anchorNode.parentNode.parentNode.appendChild(p);
            anchorNode.parentNode.removeChild(anchorNode);

            Cursor.setCursor(p, 0);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else if (anchorNode.nodeName == 'LI') {
            // li [ul, ol]返回到li 新建一行p
            let p = document.createElement('p');
            p.innerHTML = '<br/>';

            if (anchorNode.parentNode.nextSibling)
                anchorNode.parentNode.parentNode.insertBefore(p, anchorNode);
            else
                anchorNode.parentNode.parentNode.appendChild(p);
            anchorNode.parentNode.removeChild(anchorNode);

            Cursor.setCursor(p, 0);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else if (anchorNode.nodeName == 'P' && anchorNode.parentNode.nodeName == 'LI'
            && anchorNode.childNodes.length == 1 && anchorNode.childNodes[0].nodeName == 'BR') {
            // 从li中的p退到li中 
            let li = document.createElement('li');
            li.innerHTML = '<p><br/></p>';

            if (anchorNode.parentNode.nextSibling)
                anchorNode.parentNode.parentNode.insertBefore(li, anchorNode.parentNode.nextSibling);
            else
                anchorNode.parentNode.parentNode.appendChild(li);
            anchorNode.parentNode.removeChild(anchorNode);

            Cursor.setCursor(li, 0);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else if (dom.nodeName == 'PRE') {
            let text = '\n\r';
            let data = location.anchorNode.nodeValue;
            console.log(data);
            data = data.substring(0, location.anchorOffset) + text + data.substring(location.anchorOffset)
            location.anchorNode.nodeValue = data;
            Cursor.setCursor(location.anchorNode, location.anchorOffset + 1);
            artRenderRender.artRender.cursor.getSelection();
            return false;
        } else {
            console.log("无执行", location)
        }
    }

    return true;
}