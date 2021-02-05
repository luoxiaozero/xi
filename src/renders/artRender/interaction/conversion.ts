import VNode from "@/node";

/**
 * dom转虚拟节点 
 * @param dom 节点
 */
export function domToNode(dom: HTMLElement): VNode {
    let node: VNode;
    switch (dom.nodeName) {
        case "#text":
            node = new VNode("text");
            node.dom = dom;
            node._literal = dom.nodeValue;
            return node;
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
            node = new VNode("heading");
            node._level = parseInt(dom.nodeName.charAt(1));
            break;
        case "P":
            node = new VNode("paragraph");
            break;
        case "BR":
            node = new VNode("linebreak");
            break;
        case "EM":
            node = new VNode("emph");
            break;
        case "STRONG":
            node = new VNode("strong");
            break;
        case "DEL":
            node = new VNode("delete");
            break;
        case "A":
            node = new VNode("link");
            break;
        case "UL":
        case "OL":
            node = new VNode("list");
            node.listType = dom.nodeName == "UL" ? "bullet" : "ordered";
            break;
        case "LI":
            node = new VNode("item");
            break;
        case "BLOCKQUOTE":
            node = new VNode("block_quote");
            break;
        case "PRE":
            node = new VNode("code_block");
            node.dom = dom;

            for (let i = 0; i < dom.attributes.length; i++) {
                let it = dom.attributes[i];
                node.attrs[it.localName] = it.value;
            }

            let code = dom.firstChild as HTMLElement;
            node._literal = code.innerText;
            let langs = code.getAttribute("class").split(/\s/), lang = "", match;
            langs.forEach((value: string) => { 
                if (match = value.match(/^lang-(.*?)$/)){
                    lang += match[1] + " ";
                }
            })
            node._info = lang;
            return node;
        default:
            node = new VNode(dom.nodeName.toLocaleLowerCase());
            break;
    }
    node.dom = dom;

    for (let i = 0; i < dom.attributes.length; i++) {
        let it = dom.attributes[i];
        node.attrs[it.localName] = it.value;
    }

    if (dom.nodeName == 'INPUT') {
        if ((<HTMLInputElement>dom).checked) {
            node.attrs['checked'] = 'checked';
        } else if (node.attrs['checked']) {
            delete node.attrs['checked'];
        }
    }

    for (let i = 0; i < dom.childNodes.length; i++) {
        node.appendChild(domToNode(<HTMLElement>dom.childNodes[i]));
    }

    return node;
}