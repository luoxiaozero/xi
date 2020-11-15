import ArtRenderRender from "../..";

/**
     * 退格渲染
     */
export default function backRender(artRenderRender: ArtRenderRender): boolean {
    let location = artRenderRender.artRender.cursor.getSelection();
    if (location) {
        let dom = artRenderRender.rootNode.dom.childNodes[location.anchorAlineOffset];
        if (dom.nodeName == 'PRE') {
            if (location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                return false;
        } else {
            console.log("无执行", location)
        }
    }
    return true;
}