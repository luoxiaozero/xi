import ArtText from '../../artText';
import { Art } from '../../core';
/**
 * 消息管理器
 */
export default class Message {
    dom: HTMLDivElement;
    timer: any;
    constructor(artText: ArtText);
    /**
     * 创建一个消息
     * @param message 消息内容
     * @param type 消息类型[info, error, warning]
     */
    create(message: string, type?: string): void;
    /**
     * 添加消息，并计时
     * @param messageDom 消息的dom值
     */
    private addMessage;
    /**
     * 计时到，删除消息
     */
    private delMessage;
}
export declare let MessageExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
