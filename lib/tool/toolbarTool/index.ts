export default class ToolbarTool {
    toolbarDom: HTMLDivElement;
    levelPointer: {};
    constructor(){
        this.levelPointer = {};
    }

    public createDom(): HTMLDivElement {
        this.toolbarDom = document.createElement("div");
        this.toolbarDom.setAttribute('class', 'art-toolbar');
        return this.toolbarDom;
    }

    public addTool(title: string, event: Function, addDefaultClass: boolean = true, level: number = 0): HTMLSpanElement {
        let span = document.createElement('span');
        if (addDefaultClass)
            span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        if(this.levelPointer[level] != undefined){
            this.toolbarDom.insertBefore(span, this.levelPointer[level]);
            this.levelPointer[level] = span;
        } else {
            let newLevel = level;
            while(level > 0 && this.levelPointer[--level] == undefined){

            }
            if(level == 0 && this.levelPointer[level] == undefined)
                this.toolbarDom.appendChild(span);
            else
                this.toolbarDom.insertBefore(span, this.levelPointer[level]);
            this.levelPointer[newLevel] = span;
        }
        
        return span;
    }

    public addVariableToll(variable: any) {
        if (variable.addDefaultClass != undefined) {
            this.addTool(variable.text, () => { variable.click(); }, variable.addDefaultClass);
        } else {
            this.addTool(variable.text, () => { variable.click(); });
        }
    }
}