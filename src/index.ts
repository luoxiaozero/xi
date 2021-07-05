import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';
import { EditorExport } from '@/editor';
import { EventCenterExport } from '@/eventCenter';
import { ArtRenderExport } from './renders/artRender';
import { TextareaRenderExport } from './renders/textareaRender';
import { ArtLocalExport, ArtRequestExport, FileSidebarExport, MessageExport, OutlineSidebarExport, SidebarExport, ToolbarExport, VersionHistoryExport } from '../plugins';

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
Core.use(FileSidebarExport)
Core.use(ArtRequestExport)
Core.use(ArtLocalExport)