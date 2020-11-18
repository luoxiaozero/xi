import ArtText from '@/artText'
import Core from '@/core'


const win: any = window;
win.ArtText = ArtText; // 挂载到window上
Core.loaded();
export default ArtText;