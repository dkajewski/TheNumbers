<template>
    <div class="not-visible">
        <textarea id="terminal-input" ref="terminalInput" v-model="terminalInput"></textarea>
    </div>
    <div class="monitor" @click="focusTerminalInput()">
        <!-- todo: frame looks awful, it needs to look nice -->
        <div class="outer-frame">
            <div class="inner-frame">
                <div class="screen">
                    <table>
                        <tr v-for="(line, index) in terminalContent" class="terminal-line">
                            <td class="terminal-line-prefix">&gt;&nbsp;</td>
                            <td class="break-anywhere">
                                <span v-for="(letter, i) in getStringAsArray(index)"
                                      v-bind:id="`line-${index}-letter-${i}`">
                                    {{ letter }}
                                </span><span id="cursor"
                                             v-bind:class="{
                                            'terminal-cursor': !typingActive,
                                            'cursor-absolute': !cursorPositionDefault,
                                        }"
                                             v-if="(line === terminalContent[terminalContent.length - 1] && terminalContent.length - 1 === index)"
                            >&#x25AE;</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            terminalInput: '',
            terminalContent: [''],
            typingActive: false,
            lastTypedKeyTimestamp: 0,
            currentCursorPosition: {
                line: 0,
                letter: 0
            },
            cursorPositionDefault: true,
            functionalKeys: [
                'Enter',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Backspace',
                'Delete',
                'Control',
                'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
                'Shift',
                'Alt',
                'CapsLock',
                'AltGraph',
            ],
        }
    },
    created() {
        window.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'Enter') {
                e.preventDefault();
                this.executeCommand();
                this.currentCursorPosition.line++;
                this.currentCursorPosition.letter = 0;
                this.cursorPositionDefault = true;

                return;
            }

            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.cursorPositionDefault = false;
                this.handleCursorPosition(e.key);
                return;
            }

            if (e.key === 'Backspace') {
                this.currentCursorPosition.letter--;
                return;
            }

            if (!this.functionalKeys.includes(e.key)) {
                if (this.cursorPositionDefault) {
                    this.currentCursorPosition.letter++;
                }

                this.updateCurrentCommandLine(e.key);
            }

            this.typingActive = true;
            this.lastTypedKeyTimestamp = Date.now();
        });

        setInterval(this.toggleCursorAnimationModel, 1000);
    },
    methods: {
        executeCommand: function () {
            this.terminalContent.push(this.terminalInput);
            this.terminalInput = '';
        },
        focusTerminalInput: function () {
            this.$refs.terminalInput.focus();
        },
        getStringAsArray: function (lineIndex) {
            return this.terminalContent[lineIndex].split('');
        },
        handleCursorPosition: function (key) {
            if (key === 'ArrowLeft') {
                if (this.currentCursorPosition.letter > 0) {
                    this.currentCursorPosition.letter--;
                }
            }

            if (key === 'ArrowRight') {
                if (this.currentCursorPosition.letter < this.terminalContent[this.currentCursorPosition.line].length) {
                    this.currentCursorPosition.letter++;
                }
            }

            this.updateCursorPosition();
        },
        toggleCursorAnimationModel: function () {

            if (Date.now() - this.lastTypedKeyTimestamp > 100) {
                this.typingActive = false;
            }
        },
        updateCurrentCommandLine: function (key) {
            let currentLine;
            if (this.cursorPositionDefault) {
                currentLine = this.terminalContent[this.terminalContent.length - 1] + key;
            } else {
                let contentToCursorPosition = this.terminalContent[this.terminalContent.length - 1].substring(0, this.currentCursorPosition.letter);
                let contentAfterCursorPosition = this.terminalContent[this.terminalContent.length - 1].substring(this.currentCursorPosition.letter);
                currentLine = contentToCursorPosition + key + contentAfterCursorPosition;
            }

            this.terminalContent[this.terminalContent.length - 1] = currentLine;
            if (!this.cursorPositionDefault) {
                this.updateCursorPosition();
            }
        },
        updateCursorPosition: function () {
            if (this.cursorPositionDefault) {
                return;
            }

            if (this.currentCursorPosition.letter === this.terminalContent[this.terminalContent.length - 1].length) {
                if (this.currentCursorPosition.line > this.terminalContent[this.terminalContent.length - 1].length) {
                    this.currentCursorPosition.letter--;
                }
                this.cursorPositionDefault = true;
                document.getElementById('cursor').style.left = '0px';
                return;
            }

            let cursor = document.getElementById('cursor');
            let elementId = 'line-' + this.currentCursorPosition.line + '-letter-' + (this.currentCursorPosition.letter);
            let focusLetter = document.getElementById(elementId);
            if (focusLetter === null) {
                focusLetter = document.getElementById('line-' + this.currentCursorPosition.line + '-letter-' + (this.currentCursorPosition.letter - 1));
            }

            let offset = focusLetter.offsetLeft + (focusLetter.getBoundingClientRect().width) + (cursor.getBoundingClientRect().width);
            document.getElementById('cursor').style.left = offset + 'px';
        },

    },
    mounted() {
        this.focusTerminalInput();
    },
    watch: {}
}
</script>