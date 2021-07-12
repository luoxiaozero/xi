import { Art } from "..";
/**容器, 实现控制反转 */
export default class Container {
    private bindMap;
    /**绑定属性 */
    bind(identifier: string, clazz: any, constructorArgs?: Array<any>, renderFlag?: boolean): void;
    /**获取属性 */
    get<T>(identifier: string, art: Art): T;
    /**容器是否存在属性 */
    has(identifier: string): boolean;
}
