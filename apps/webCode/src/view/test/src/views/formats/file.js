import Quill from 'quill';
import { sanitize } from 'quill/formats/link';
const ImageBlot = Quill.import('formats/image');

class File extends ImageBlot {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'object') {
        node.setAttribute('contenteditable',false)
        node.setAttribute('class','fileClass')
        var divDom = document.createElement('div')
        divDom.setAttribute('class','quill_File')
        var imgdom = document.createElement('img')
        imgdom.setAttribute('contenteditable',false)
        imgdom.setAttribute('src', this.sanitize(value.src));
        imgdom.setAttribute('title', value.title);
        imgdom.setAttribute('alt',value.alt);
        var titleDom = document.createElement('div')
        titleDom.setAttribute('class','titleDom')
        titleDom.setAttribute('contenteditable',false)
        titleDom.innerHTML='<p>'+value.alt+'</p>'
        divDom.appendChild(imgdom)
        divDom.appendChild(titleDom)
        node.appendChild(divDom)
    }
    return node;
  }
  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }
  static value(node){
      console.log(node,666);
        return {
            src: node.getAttribute('src'),
            id: node.getAttribute('class'),
            title:node.getAttribute('title'),
            alt:node.getAttribute('alt'),
        };
    }
}
File.blotName = 'file';
File.tagName = 'div';

export default File;
