import ArtText from "lib";

export function message(artText: ArtText, message: string, type: string='null'){
    let root = document.createElement('div');
    root.style.position = 'fixed';
    
    root.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
    root.style.borderRadius = '4px';
    //root.style.border  = '1px solid #eee';
    root.style.left = '50%';
    root.style.margin = '-27px 0 0 -170px';
    root.style.position = 'fixed !important';
    root.style.top = '40px';
    root.style.height = '40px';
    root.style.lineHeight ='40px';
    root.style.width = '340px';
    root.style.padding = '1px 10px 1px 15px'
    root.style.transition = 'opacity .3s,transform .4s,top .4s,-webkit-transform .4s';
    root.style.overflow = 'hidden';

    let p = document.createElement('p');
    p.innerHTML = message;
    p.style.fontSize = '13px';
    p.style.fontWeight = '600';
    p.style.height = '100%';
    p.style.margin = '0';
    root.appendChild(p);

    if(type == 'info'){
        root.style.backgroundColor = '#edf2fc';
        root.style.borderColor = '#EBEEF5';
        root.style.color = '#909399';
    }else if(type == 'success'){
        root.style.backgroundColor = '#f0f9eb';
        root.style.borderColor = '#e1f3d8';
        root.style.color = '#67C23A';
    }else if(type == 'warning'){
        root.style.backgroundColor = '#fdf6ec';
        root.style.borderColor = '#faecd8';
        root.style.color = '#E6A23C';
    }else if(type == 'error'){
        root.style.backgroundColor = '#fef0f0';
        root.style.backgroundColor = '#fde2e2';
        root.style.borderColor = '#e1f3d8';
        root.style.color = '#F56C6C';
    }else{
        root.style.backgroundColor = artText.config.theme.get('backgroundColor');
        root.style.color = '#676767';
    }

    setTimeout(()=>{artText.container.removeChild(root);},3000);
    artText.container.appendChild(root);
    return root;
}