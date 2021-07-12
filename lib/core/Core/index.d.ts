import Tool from "../../tool";
import Art from "../Art";
import Container from "../Container";
/**核心 */
export default class Core {
    private static plugins;
    static container: Container;
    static options: {
        container: Container;
        Tool: typeof Tool;
    };
    /**添加插件 */
    static use(plugin: any): void;
    /**构造时期执行 */
    static createdArt(art: Art): void;
    /**挂载时期执行 */
    static mountArt(art: Art): void;
    /**卸载时期执行 */
    static unmountArt(art: Art): void;
}
