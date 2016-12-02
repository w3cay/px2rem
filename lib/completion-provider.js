'use babel';

const pxPattern = /^\d+(p|px)$/;

class CompletionProvider {
    constructor() {
        this.selector = '.source.scss, .source.css, .source.less, .source.styl';
        this.disableForSelector = '.source.css .comment, .source.css .string, .source.sass .comment, .source.sass .string, .source.less .comment, .source.less .string, .source.styl .comment, .source.styl .string';
    }

    getSuggestions({
        editor,
        bufferPosition,
        prefix
    }) {
        let remNum;
        let pxNum;
        const baseSize = atom.config.get('pxtorem.baseSize');
        const Precision = atom.config.get('pxtorem.Precision');
        const line = editor.getTextInRange([
            [bufferPosition.row, 0], bufferPosition
        ]);

        if (pxPattern.test(prefix)) {
            pxNum = parseFloat(prefix.replace(/\s+/g), '');

            // 1px 不转换为 rem
            if (pxNum <= 1) {
                return false;
            }

            remNum = pxNum / baseSize;
            remNum = remNum.toFixed(Precision) + '';
            const tempArr = remNum.split('.');
            if (tempArr[0] === '0') {
                remNum = `.${tempArr[1]}`;
            } else if (parseInt(tempArr[1]) === 0) {
                remNum = `${tempArr[0]}`;
            }
            return [{
                text: `${remNum}rem; /* ${pxNum}/${baseSize} */`
            }];
        }
    }
};

export default CompletionProvider;
