'use babel';

const pxPattern = /\d+px/gm;

const px2rem = {
  config: {
    baseSize: {
      title: 'Default Base Size',
      description: 'This will change the base size to convert px to rem.',
      type: 'integer',
      default: 50,
      minimum: 1,
    },
  },

  activate() {
    const _this = this;
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    let row;
    let rowText;
    console.log(buffer);

    buffer.onDidChange(function (e) {
      if (e.newText === 'p') {
        row = e.newRange.end.row;
        rowText = buffer.lines[row];
      }
    });

    atom.commands.add('atom-workspace', 'px2rem:convert', function () {
      _this.convert();
    });
  },

  convert() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    let pxNum;
    let remNum;

    editor.scan(pxPattern, function (obj) {
      pxNum = parseFloat(obj.match[0].replace(/\s+/g), '');

      if (pxNum <= 1) {
        return false;
      }

      remNum = pxNum / atom.config.get('px2rem.baseSize');

      obj.replace(remNum + 'rem');
    });
  },
};

module.exports = px2rem;
