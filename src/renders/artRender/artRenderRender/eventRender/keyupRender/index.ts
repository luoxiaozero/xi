import ArtRenderRender from "../..";
import { domToNode } from "../../grammer";
import vnodeRender from "../../vnodeRender";
import { VNode } from "../../vObject";

/**
 * 摁键抬起时渲染
 */
export default function keyupRender(artRenderRender: ArtRenderRender): boolean {
    artRenderRender.rootNode.replaceAllChild((domToNode(artRenderRender.rootNode.dom) as VNode).childNodes);

    artRenderRender.vnodeDispose(artRenderRender.rootNode);
    vnodeRender(artRenderRender.rootNode.dom, artRenderRender.rootNode);

    return false;
}