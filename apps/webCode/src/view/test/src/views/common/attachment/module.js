import Quill from 'quill/core/quill';
import modules from 'quill/core/module';

class mFile extends modules {

  constructor(...args) {
    super(...args);
  }
  preView(func){
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
        var quill_File = document.getElementsByClassName('quill_File')
        if(quill_File.length>0){
            for(var dom of quill_File){
                dom.addEventListener('click',func)
            }
        }
    });
  }
  openUpLoadDailog(){
    var dom = document.createElement('div')
    dom.setAttribute('class','upLoad_dailog')
  }
}

export default mFile;
