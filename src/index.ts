import ArtText, { ArtTextExport } from '@/artText'
import { Core } from '@/core'
import { ToolExport } from '@/tool';

Core.use(ArtTextExport);
Core.use(ToolExport);

export default ArtText;