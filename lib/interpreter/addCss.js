const css = '\n\
.art-hide{display: inline-block;width: 0;height: 0;overflow: hidden;vertical-align: middle;}\n\
.art-show{color: #ccc;}\n\
.art-editor pre code{white-space: pre-wrap;}'

export default function addCss(){
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet){
        style.styleSheet.cssText = css;
    }else{
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}