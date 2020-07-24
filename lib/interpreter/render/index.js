import katex from "../js/katex.min.js"
import tableTool from "../../tool/tableTool"
import imgTool from "../../tool/imgTool"
function  nodeRender(rootNode, rootNodeSub , node){
    if(node == null){
        return null;
    }
    let dom;
    if(rootNodeSub == -1){
        dom = rootNode;
        for(let i = 0, j = 0;i < dom.childNodes.length || j < node.length; i++, j++){
            if(dom.childNodes[i] && hasClass(dom.childNodes[i], "art-tool"))
                i++;
            let _dom = null, _node = null;
            if(i < dom.childNodes.length){
                _dom = dom.childNodes[i];
            }
            if(j < node.length){
                _node = node[j];
            }
            _dom = renderHtml(_dom, _node);
            if(_dom){
                dom.appendChild(_dom);
            }
        }
    }else{
        dom = rootNode.childNodes[rootNodeSub];
        let _dom;
        for(let i= 0; i< node.length; i++){
            if(i == 0){
                renderHtml(dom, node[0]);
            }else{
                _dom = renderHtml(null, node[i]);
                if(_dom){
                    if(dom.nextSibling){
                        rootNode.insertBefore(_dom, dom.nextSibling);
                    }else{
                        rootNode.appendChild(_dom);
                    }
                }
            }
        }
            
    }
        
}
function renderHtml(dom, node){
        if(!(dom || node)){
            return null;
        }else if(dom === null){
            return renderChildHtml(node);
        }else if(node === null){
            console.log("remove node", dom, dom.innerHTML)
            dom.parentNode.removeChild(dom);
            return false;
        }
        if(dom.nodeName.toLowerCase() === node[0]){
            if(node[0] === "#text"){
                if(node[2] === dom.nodeValue){
                    return null;
                }else{
                    console.log("render fuzhi text")
                    dom.nodeValue = node[2];
                    return false;
                }
            }
            if(hasClass(dom, "art-shield") ){
                let math = dom.getAttribute("art-math")
                if(math && node[1]["art-math"] !== math){
                    let html = katex.renderToString(node[1]["art-math"], {
                        throwOnError: false
                    });
                    dom.innerHTML = html;
                }
                for (let key in node[1]){
                    if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                        dom.setAttribute(key, node[1][key]);
                    }
                }
            }else{
                for (let key in node[1]){
                    if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                        dom.setAttribute(key, node[1][key]);
                    }
                }
                if(node[2] === null)
                    node[2] = []
                for(let i = 0, j = 0;i < dom.childNodes.length || j < node[2].length; i++, j++){
                    let _dom = null, _node = null;
                    if(i < dom.childNodes.length){
                        _dom = dom.childNodes[i];
                    }
                    if(j < node[2].length){
                        _node = node[2][j];
                    }
                    
                    _dom = renderHtml(_dom, _node)
                    if(_dom){
                        dom.appendChild(_dom);
                    }
                }
            }
        }else{
            let _dom = renderChildHtml(node)
            dom.parentNode.replaceChild(_dom, dom); 
        }
        return null;
    }
function renderChildHtml(node){
        if(node[0] === "#text"){
            console.log("child create text")
            return document.createTextNode(node[2]);
        }
        console.log("child create", node[0])
        let _dom = document.createElement(node[0]);
        for (let key in node[1]){
            if(key === "__dom__"){
                if(node[1][key] === "math"){
                    console.log("math", node[2])
                    let html = katex.renderToString(node[1]["art-math"], {
                        throwOnError: false
                    });
                    console.log("math html", html)
                    _dom.innerHTML = html;
                }else if(node[1][key] === "tableTool"){
                    _dom.appendChild(tableTool())
                }else if(node[1][key] === "imgTool"){
                    _dom.appendChild(imgTool())
                }
               
            }
            else if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                _dom.setAttribute(key, node[1][key]);
            }
        }
        if(node[2] === null)
            node[2] = []
        if (node[2] && node[2].length > 0){
            node[2].forEach((element) => {
                _dom.appendChild(renderChildHtml(element));
            })
        }
        return _dom;
    }
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
export {nodeRender}