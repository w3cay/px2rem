'use babel';

import CompletionProvider from './completion-provider';

const pxPattern = /\d+px/gm;

class Pxtorem {
    config = {
        baseSize: {
            title: 'Default Base Size',
            description: 'This will change the base size to convert px to rem.',
            type: 'number',
            default: 75,
            minimum: 1,
        },
        Precision: {
            title: 'Default Precision',
            description: 'The number of digits to the right of the decimal point ',
            type: 'integer',
            default: 2,
            minimum: 0,
        },
        Mark: {
            title: 'Add Mark',
            description: 'Add origin pixel value like /* 100/75 */',
            type: 'boolean',
            default: true,
        }
    };

    activate() {
        const _this = this;

        atom.commands.add('atom-workspace', 'pxtorem:convert', function() {
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
        const baseSize = atom.config.get('pxtorem.baseSize');
        const precision = atom.config.get('pxtorem.Precision');
        const isMark = atom.config.get('pxtorem.Mark');
        let pxNum;
        let remNum;

        editor.scan(pxPattern, function(obj) {
            pxNum = parseFloat(obj.match[0].replace(/\s+/g), '');

            // 1px 不转换为 rem
            if (pxNum <= 1) {
                return false;
            }
            remNum = pxNum / baseSize;
            remNum = remNum.toFixed(precision) + '';
            const tempArr = remNum.split('.');
            if (tempArr[0] === '0') {
                remNum = `.${tempArr[1]}`;
            } else if (parseInt(tempArr[1]) === 0) {
                remNum = `${tempArr[0]}`;
            }

            const textTemp = isMark ? `${remNum}rem; /* ${pxNum}/${baseSize} */` : `${remNum}rem;`;

            obj.replace(textTemp);
        });
    }
}

export default new Pxtorem();
