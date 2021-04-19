import VNode from "@/renders/artRender/node";
import Tool from "@/tool";

function enterExternalDomToMd(dom: HTMLElement): string {
    switch (dom.nodeName) {
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
            return "#".repeat(parseInt(dom.nodeName.charAt(1))) + " ";
        case "A":
            if (dom.childNodes.length)
                return "[";
            break;
        case "EM":
            return "*";
        case "STRONG":
            return "**";
        case "DEL":
            return "~~";
        case "PRE":
            let code = dom.firstChild as HTMLElement, lang = "";
            if (code?.nodeName === "CODE") {
                let match;
                code.getAttribute("class")?.split(/\s/).forEach((value: string) => {
                    if (match = value.match(/^lang-(.*?)$/)) {
                        lang += match[1] + " ";
                    }
                });
            }
            return "```" + lang + "\n";
    }
    return "";
}

function leaveExternalDomToMd(dom: HTMLElement) {
    switch (dom.nodeName) {
        case "UL":
        case "OL":
        case "BLOCKQUOTE":
        case "P":
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
            return '\n\n';
        case "A":
            if (dom.childNodes.length)
                return "](" + (dom as HTMLAnchorElement).href + ")";
            break;
        case "EM":
            return "*";
        case "STRONG":
            return "**";
        case "DEL":
            return "~~";
        case "PRE":
            return "```\n\n";
    }
    return "";
}

export function externalDomToMd(dom: HTMLElement): string {
    let md = "";
    if (dom.nodeName === "#text")
        return dom.nodeValue;
    else if (dom.nodeName === "BR")
        return "<br\\>";
    else if (dom.nodeName == "INPUT" && dom instanceof HTMLInputElement && dom.type === "checkbox") {
        if (dom.checked) {
            return "[x] "
        } else {
            return "[ ] "
        }
    } else if (dom.nodeName === "LI") {
        let str: string, spaceNumbar = "", flag = true;
        let parent = dom.parentElement;
        while (parent) {
            if (parent.nodeName === "OL") {
                spaceNumbar += "   ";
            } else if (parent.nodeName === "UL") {
                spaceNumbar += "  ";
            } else if (parent.nodeName !== "item") {
                break;
            }
            parent = parent.parentElement;
        }

        parent = dom.parentElement;
        if (parent.nodeName === "OL") {
            for (let i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i] === dom) {
                    md += (i + 1) + ". ";
                    break;
                }
            }
        } else {
            md += "* ";
        }

        for (let i = 0; i < dom.childNodes.length; i++) {
            switch (dom.childNodes[i].nodeName) {
                case "UL":
                case "OL":
                case "BLOCKQUOTE":
                case "P":
                    let md_2 = externalDomToMd(dom.childNodes[i] as HTMLElement);
                    let strs = md_2.substring(0, md_2.length - 1).split("\n");
                    console.log(strs, md_2);
                    for (let i = 0; i < strs.length; i++) {
                        if (strs[i]) {
                            if (flag) {
                                md += strs[i] + "\n";
                                flag = false;
                            } else {
                                md += spaceNumbar + strs[i] + "\n"
                            }
                        }

                    }
                    break;
                default:
                    md += externalDomToMd(dom.childNodes[i] as HTMLElement);
            }
        }
        return md;
    } else if (dom.nodeName === "BLOCKQUOTE") {
        for (let i = 0; i < dom.childNodes.length; i++) {
            switch (dom.childNodes[i].nodeName) {
                case "UL":
                case "OL":
                case "BLOCKQUOTE":
                case "P":
                    let md_2 = externalDomToMd(dom.childNodes[i] as HTMLElement);
                    let strs = md_2.substring(0, md_2.length - 1).split("\n");
                    strs.forEach(value => md += "> " + value + "\n");
                    break;
                default:
                    md += "> " + externalDomToMd(dom.childNodes[i] as HTMLElement);
            }
        }
        return md;
    }

    md += enterExternalDomToMd(dom);

    for (let i = 0; i < dom.childNodes.length; i++) {
        md += externalDomToMd(dom.childNodes[i] as HTMLElement);
    }
    if (dom.nodeName === "PRE") {
        if (md && md[md.length - 1] !== '\n')
            md += '\n';
    }

    md += leaveExternalDomToMd(dom);

    return md;
}

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
        case "DIV":
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
                if (match = value.match(/^lang-(.*?)$/)) {
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

    if (!Tool.hasClass(dom, "art-shield")) {
        for (let i = 0; i < dom.childNodes.length; i++) {
            node.appendChild(domToNode(<HTMLElement>dom.childNodes[i]));
        }
    }


    return node;
}