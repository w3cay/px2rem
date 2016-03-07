'use babel';

import CompletionProvider from './completion-provider';

const pxPattern = /\d+px/gm;

class Px2rem {
  config = {
    baseSize: {
      title: 'Default Base Size',
      description: 'This will change the base size to convert px to rem.',
      type: 'integer',
      default: 50,
      minimum: 1,
    }
  };

  activate() {
    const _this = this;

    atom.commands.add('atom-workspace', 'px2rem:convert', function () {
      _this.convert();
    });

    this.completionProvider = new CompletionProvider();
  }

  deactivate() {
    delete this.completionProvider;
    this.completionProvider = null;
  }

  provide() {
    return this.completionProvider;
  }

  convert() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    let pxNum;
    let remNum;

    editor.scan(pxPattern, function (obj) {
      pxNum = parseFloat(obj.match[0].replace(/\s+/g), '');

      // 1px 不转换为 rem
      if (pxNum <= 1) {
        return false;
      }

      remNum = pxNum / atom.config.get('px2rem.baseSize');
      obj.replace(remNum + 'rem');
    });
  }
}

export default new Px2rem();
