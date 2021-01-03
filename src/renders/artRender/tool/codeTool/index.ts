export default function initCodeTool(root: HTMLElement, lang: string = ''): void {
    root.innerHTML = '';
    root.setAttribute('style', 'visibility:hidden;')

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
}

function changCodeLang() {
    let preDom = (<HTMLInputElement>this).parentNode.nextSibling;
    (<HTMLElement>preDom.childNodes[0]).className = 'lang-' + this.value;
}