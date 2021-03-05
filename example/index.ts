import ArtText from '../src'
import './imgs/tu.jpg'
import sample from './md/sample'
import table from './md/table'
import code_block from "./md/code_block"
import list from "./md/list";
import blockquote from "./md/blockquote";

let defaultMd = sample;"\n\
ds\n\
$$\n\
\\frac{1}{\n\
  \\Bigl(\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{\n\
  \\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {\n\
    1+\\frac{e^{-6\\pi}}\n\
    {1+\\frac{e^{-8\\pi}}{1+\cdots}}\n\
  }\n\
}\n\
$$\n\
sdff\n\
\n\
<figure><table>\n\
<thead>\n\
<tr><th style='text-align:center;' >A</th><th style='text-align:left;' >B</th><th style='text-align:right;' >C</th></tr></thead>\n\
<tbody><tr><td style='text-align:center;' >100</td><td style='text-align:left;' >90</td><td style='text-align:right;' >80</td></tr></tbody>\n\
</table></figure>\n\
<hr />\n\
";

window.onload = function () {
    const art: ArtText = new ArtText({ defaultMd: defaultMd }).mount('#art');
    window['art'] = art;
}