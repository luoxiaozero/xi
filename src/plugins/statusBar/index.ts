import ArtText from "../../artText";
import { Art } from "../../core";
import { fullScreenExport, switchRenderButtonExport } from "./default";
import "./styles/index.css";

/**
 * 任务栏
 */
export default class StatusBar {
    artText: ArtText;
    dom: HTMLDivElement;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-statusBar');

        this.artText.domContent.appendChild(this.dom);
    }

    /**
     * 添加按钮
     * @param  按钮  
     */
    public addButton(button: { dom: HTMLElement, float: "left" | "right", onClick: Function}): HTMLSpanElement {
        let span = document.createElement('span');
        span.setAttribute('class', `art-statusBar__button art-statusBar__button--${button.float}`);
        span.appendChild(button.dom);
        span.addEventListener('click', <EventListenerOrEventListenerObject>button.onClick);
        this.dom.appendChild(span);
        return span;
    }
}

export let StatusBarExport = {
    install: function (Art, options) {
        ArtText.use(switchRenderButtonExport);
        ArtText.use(fullScreenExport);
        options['container'].bind('statusBar', StatusBar, [{'get': 'art'}], true);
    },
    created: function (art: Art , options) {
        art.get<StatusBar>('statusBar');
    }
}