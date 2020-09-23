export default class ToolbarTool{
    toolbarDom: HTMLDivElement;
    public createDom(): HTMLDivElement{
        this.toolbarDom = document.createElement("div"); 
        this.toolbarDom.setAttribute('class', 'art-toolbar');
        return this.toolbarDom;
    }
    
    public addTool(title: string, event: Function, addDefaultClass: boolean=true): HTMLSpanElement{
        let span = document.createElement('span');
        if(addDefaultClass)
            span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        this.toolbarDom.appendChild(span);
        return span;
    }
}