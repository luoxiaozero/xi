/**原型 */
export default class Art {
    constructor();
    /**获取值 */
    get<T>(key: any): T;
    /**设置值 */
    set(key: any, value?: any): void;
}
