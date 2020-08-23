function loadScript(url: string, callback: Function): void{
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof callback != "undefined") {
        script.onload = function () {
            callback();
        }
    };
    script.src = url;
    document.body.appendChild(script);
}
function loadCss(url: string): void{
    var head = document.getElementsByTagName('head')[0];

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    head.appendChild(link);
}

function addCss(css: string): void{
    var head = document.head || document.getElementsByTagName('head')[0];

    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    head.appendChild(style);
}
function hasClass(element: HTMLElement, cls: string): boolean{
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
export {loadCss, loadScript, addCss, hasClass}