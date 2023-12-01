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
            ]
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
            }

            if (e.key === 'Backspace') {
                this.currentCursorPosition.letter--;
            }


            if (!this.functionalKeys.includes(e.key)) {
                this.currentCursorPosition.letter++;
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

                if (this.currentCursorPosition.letter === this.terminalContent[this.currentCursorPosition.line].length) {
                    this.cursorPositionDefault = true;
                    document.getElementById('cursor').style.left = '0px';

                    return;
                }
            }

            this.updateCursorPosition();
        },
        toggleCursorAnimationModel: function () {

            if (Date.now() - this.lastTypedKeyTimestamp > 100) {
                this.typingActive = false;
            }
        },
        updateCurrentCommandLine: function () {
            if (this.terminalContent.length === 0) {
                this.terminalContent.push(this.terminalInput);
            }

            this.terminalContent[this.terminalContent.length - 1] = this.terminalInput;
            if (!this.cursorPositionDefault) {
                this.updateCursorPosition();
            }
        },
        updateCursorPosition: function () {
            if (this.cursorPositionDefault) {
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
    watch: {
        terminalInput: function () {
            this.updateCurrentCommandLine();
        }
    }
}
</script>