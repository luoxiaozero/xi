import ArtText from '@/artText'
import { Art } from '@/core';
import EventCenter from '@/eventCenter';
import ArtRenderEvent from '.';

export function installShortcutKey(artRenderEvent: ArtRenderEvent) {
    // ctrl + s 保存
    artRenderEvent.addCustomizeEvent("art-ShortcutKey-Control+s", () => {save(artRenderEvent.artRender.artText)});
    // ctrl + b 粗体
    artRenderEvent.addCustomizeEvent("art-ShortcutKey-Control+b", () => {blod(artRenderEvent.artRender.artText)}); 
    // ctrl + i 斜体
    artRenderEvent.addCustomizeEvent("art-ShortcutKey-Control+i", () => {italic(artRenderEvent.artRender.artText)}); 
    // ctrl + shift + d 删除线
}

function save(art: Art) {
    art.get<EventCenter>("$eventCenter").emit("art-save");
}

function blod(artText: ArtText) {
    model(artText, '**');
}

function italic(artText: ArtText) {
    model(artText, '*');
}

function del(artText: ArtText){
    model(artText, '~~');
}

function model(artText: ArtText, str: string) {
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