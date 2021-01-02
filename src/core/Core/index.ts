import Art from "../Art";
import Container from "../Container";

/**核心 */
export default class Core {
    static plugins = [];
    static container: Container = new Container();

    /**添加插件 */
    static use(plugin: any) {
        plugin.install(Art, {'container': Core.container});
        Core.plugins.push(plugin);
    }

    /**构造时期执行 */
    static createdArt(art: any) {
        for (let p of Core.plugins) {
            if (p['created'])
                p.created(art, {'container': Core.container});
        }
    }

    /**挂载时期执行 */
    static mountArt(art: any) {
        for (let p of Core.plugins) {
            if (p['mount'])
                p.mount(art, {'container': Core.container});
        }
    }

    /**卸载时期执行 */
    static unmountArt(art: any) {
        for (let p of Core.plugins) {
            if (p['unmount'])
                p.unmount(art, {'container': Core.container});
        }
    }
}
