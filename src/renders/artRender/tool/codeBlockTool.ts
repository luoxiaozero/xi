
export default function createCodeBlockTool(currentDom: HTMLElement, lang: string = ''): void {
    let root = document.createElement("div");
    root.setAttribute("class", "art-meta art-shield art-codeBlockTool");
    root.setAttribute("style", "visibility:hidden");
    root.setAttribute("contenteditable", "false");

    let prompt = document.createElement('span');
    prompt.style.letterSpacing = '4px';
    prompt.style.color = '#aaa';
    prompt.style.position = 'relative';
    prompt.style.top = '3px';
    prompt.innerHTML = '```'

    let langInput = document.createElement('input');
    langInput.setAttribute('style',
        'font-size:14px;letter-spacing:1px;font-weight: 600;padding: 1px 2px;border: none;outline: none;color: #1abc9c;display: flex;flex-direction: column;flex: 1 1 0%;')
    langInput.title = '设置代码语言';
    langInput.value = lang;
    langInput.onchange = changCodeLang;

    root.appendChild(prompt);
    root.appendChild(langInput);

    currentDom.appendChild(root);
}

function changCodeLang() {
    let preDom = (<HTMLInputElement>this).parentNode.nextSibling;
    (<HTMLElement>preDom.childNodes[0]).className = 'lang-' + this.value;
}