import Tool from "../../tool";
import Art from "../Art";
import Container from "../Container";

/**核心 */
export default class Core {
    private static plugins = [];
    public static container: Container = new Container();
    public static options = {'container': Core.container, 'Tool': Tool};

    /**添加插件 */
    public static use(plugin: any): void{
        if (plugin['install'])
            plugin.install(Art, Core.options);
        Core.plugins.push(plugin);
    }

    /**构造时期执行 */
    public static createdArt(art: Art): void {
        for (let p of Core.plugins) {
            if (p['created'])
                p.created(art, Core.options);
        }
    }

    /**挂载时期执行 */
    public static mountArt(art: Art): void {
        for (let p of Core.plugins) {
            if (p['mount'])
                p.mount(art, Core.options);
        }
    }

    /**卸载时期执行 */
    public static unmountArt(art: Art): void {
        for (let p of Core.plugins) {
            if (p['unmount'])
                p.unmount(art, Core.options);
        }
    }
}
