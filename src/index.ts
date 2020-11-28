import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';
import { EditorExport } from '@/editor';

Core.use(ArtTextExport);
Core.use(ToolExport);
Core.use(EditorExport);
export default ArtText;