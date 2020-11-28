import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';
import { EditorExport } from '@/editor';
import { EventCenterExport } from '@/eventCenter';

Core.use(ArtTextExport);
Core.use(ToolExport);
Core.use(EditorExport);
Core.use(EventCenterExport);
export default ArtText;