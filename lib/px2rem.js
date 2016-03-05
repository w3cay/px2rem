'use babel';

const pxPattern = /\d+px/gm;

class Px2rem {

  config = {
    baseSize: {
      title: 'Default Base Size',
      description: 'This will change the base size to convert px to rem.',
      type: 'integer',
      default: 50,
      minimum: 1,
    },
    sources: {
      title: 'Default File Type',
      description: '有效的文件类型',
      type: 'array',
      default: ['scss', 'css', 'less'],
    },
  };

  activate() {
    const _this = this;

    const getFileType = () => {
      if (this.activeEditor && this.activeEditor.getPath) {
        return this.activeEditor.getPath().split('.').pop();
      } else {
        return false;
      }
    };

    this.activeEditor = atom.workspace.getActiveTextEditor();
    _this.fileType = getFileType();
    _this.onDidChange();

    atom.commands.add('atom-workspace', 'px2rem:convert', function () {
      _this.convert();
    });

    atom.workspace.onDidChangeActivePaneItem(function (item) {
      _this.activeEditor = item;
      _this.fileType = getFileType();
      _this.onDidChange();
    });
  }

  isValidFile() {
    let sources = atom.config.get('px2rem.sources');
    let flag = false;

    for (let i = 0; i < sources.length; i++) {
      if (sources[i] === this.fileType) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  onDidChange() {
    if (!typeof this.activeEditor.getBuffer || !this.isValidFile()) return false;

    let buffer = this.activeEditor.getBuffer();
    let row;
    let rowText;

    buffer.onDidChange(function (e) {
      console.log(e);
      if (e.newText === 'p') {
        row = e.newRange.end.row;
        rowText = buffer.lines[row];
      }
    });
  }

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
  }

}

const px2rem = new Px2rem();
export default px2rem;
