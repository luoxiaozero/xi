import ArtText from '@/artText'

export function blod(artText: ArtText) {
    model(artText, '**');
}

export function italic(artText: ArtText) {
    model(artText, '*');
}
export function del(artText: ArtText){
    model(artText, '~~');
}
export function ins(artText: ArtText){
    model(artText, '__');
} 
export function sup(artText: ArtText){
    model(artText, '^');
}
export function sub(artText: ArtText){
    model(artText, '~');
} 
export function mark(artText: ArtText) {
    model(artText, '==');
}
function model(artText: ArtText, str: string) {
    artText;
    str;
    return null;
    //let location = artText.editor.cursor.getSelection();
    /*if(location.focusNode.nodeName == '#text'){
        let nodeValue = location.focusNode.nodeValue;
        nodeValue = nodeValue.substring(0, location.focusOffset) + str + nodeValue.substring(location.focusOffset)
        location.focusNode.nodeValue = nodeValue;
    }else{
        let nodeValue = (<HTMLElement>location.focusNode).innerText;
        nodeValue = nodeValue.substring(0, location.focusOffset) + str + nodeValue.substring(location.focusOffset);
        (<HTMLElement>location.focusNode).innerText = nodeValue;
    }

    if(location.anchorNode.nodeName == '#text'){
        let nodeValue = location.anchorNode.nodeValue;
        nodeValue = nodeValue.substring(0, location.anchorOffset) + str + nodeValue.substring(location.anchorOffset)
        location.anchorNode.nodeValue = nodeValue;
    }else{
        let nodeValue = (<HTMLElement>location.anchorNode).innerText;
        nodeValue = nodeValue.substring(0, location.anchorOffset) + str + nodeValue.substring(location.anchorOffset);
        (<HTMLElement>location.anchorNode).innerText = nodeValue;
    }
    
    //artText.editor.render();
    //location.focusInlineOffset += str.length * 2;
    //location.anchorInlineOffset = location.focusInlineOffset;
    //artText.editor.cursor.setSelection(location);*/
}