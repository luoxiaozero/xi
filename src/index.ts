import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';
import { EditorExport } from '@/editor';
import { EventCenterExport } from '@/eventCenter';
import { ToolbarExport } from './plugins/toolbar';
import { MessageExport } from './plugins/message';
import { VersionHistoryExport } from './plugins/versionHistory';
import { SidebarExport } from './plugins/sidebar';
import { ArtRenderExport } from './renders/artRender';
import { TextareaRenderExport } from './renders/textareaRender';
import { OutlineSidebarExport } from './plugins/outlineSidebar';

export default ArtText;

/**核心插件 */
Core.use(ArtTextExport);
Core.use(ToolExport);
Core.use(EditorExport);
Core.use(EventCenterExport);
Core.use(ArtRenderExport);

/**默认插件 */
Core.use(ToolbarExport)
Core.use(SidebarExport)
Core.use(OutlineSidebarExport)
Core.use(MessageExport)
Core.use(VersionHistoryExport)
Core.use(TextareaRenderExport)

/**用户自定义插件 */

