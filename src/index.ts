import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';
import { EditorExport } from '@/editor';
import { EventCenterExport } from '@/eventCenter';
import { PluginCenterExport } from '@/pluginCenter';
import { ToolbarExport } from './plugins/toolbar';
import { MessageExport } from './plugins/message';

export default ArtText;

/**核心插件 */
Core.use(ArtTextExport);
Core.use(ToolExport);
Core.use(EditorExport);
Core.use(EventCenterExport);
Core.use(PluginCenterExport);

/**默认插件 */
Core.use(ToolbarExport)
Core.use(MessageExport)

/**用户自定义插件 */

