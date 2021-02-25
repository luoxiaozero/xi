
export default function createMathBlockTool(root: HTMLElement, place: string = 'start'): void {
    root.setAttribute("class", "art-meta art-shield art-mathBlockTool");
    root.setAttribute("contenteditable", "false");

    let prompt = document.createElement('span');
    prompt.style.letterSpacing = '1.5px';
    prompt.style.marginLeft = "8px";
    prompt.style.color = '#aaa';
    prompt.style.fontSize = "14px";
    prompt.innerHTML = '$$'

    root.appendChild(prompt);
}

