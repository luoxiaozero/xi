import ArtText from '../lib'
import "./markdown.css"

const container = document.querySelector('#art');
const art = new ArtText(container);
        
art.init();