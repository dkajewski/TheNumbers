<script setup>
import Clock from '../components/Clock.vue';
import EventLog from "../components/EventLog.vue";
</script>
<template>
    <div class="not-visible">
        <textarea id="terminal-input" ref="terminalInput" v-model="terminalInput"></textarea>
    </div>
    <Clock v-bind:clock-state="clockState" v-on:system-failure="activateSystemFailure"/>
    <div class="button-wrapper"><button id="show-modal" v-on:click="showModal = true">Event Log</button></div>
    <div class="monitor" @click="focusTerminalInput()">
        <!-- todo: frame looks awful, it needs to look nice -->
        <div class="outer-frame">
            <div class="inner-frame">
                <div class="screen">
                    <table>
                        <tr v-for="(line, index) in terminalContent" class="terminal-line">
                            <td class="terminal-line-prefix">&gt;:&nbsp;</td>
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
                        <tr>
                            <td class="terminal-line-prefix">&nbsp;&nbsp;</td>
                            <td class="break-anywhere" v-html="systemFailureText"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <EventLog v-if="showModal" v-on:close="showModal = false" show />
</template>
<script>
import Utility from "../helpers/utility";
export default {
    data() {
        return {
            clockState: 'running',
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
            gameOver: false,
            maxSecondsAfterSystemFailure: 16,
            systemFailureActive: false,
            systemFailureInterval: null,
            systemFailureText: '',
            systemFailureTime: 0,
            gameOverInterval: null,
            showModal: false,
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
                this.handleBackspaceKeyAction();
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
        activateSystemFailure: function () {
            Utility.pushLogEntry('SYSTEM FAILURE');
            this.systemFailureTime = Date.now();
            this.terminalContent = [this.terminalContent[this.terminalContent.length - 1]];
            this.systemFailureInterval = setInterval(() => {
                this.systemFailureText += 'System Failure';
            }, 600);
            this.gameOverInterval = setInterval(() => {
                if (Date.now() > this.systemFailureTime + (this.maxSecondsAfterSystemFailure * 1000)) {
                    this.gameOver = true;
                    Utility.pushLogEntry('THE HATCH IMPLODED. GAME OVER');
                    clearInterval(this.systemFailureInterval);
                    clearInterval(this.gameOverInterval);
                }
            }, 1000);
        },
        executeCommand: function () {
            let command = this.terminalContent[this.terminalContent.length - 1].trim();
            this.handleClockResetCommand(command);

            this.terminalInput = '';
            this.terminalContent.push('');
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
        handleBackspaceKeyAction: function () {
            let currentLine = this.terminalContent[this.terminalContent.length - 1];
            if (this.cursorPositionDefault) {
                this.terminalContent[this.terminalContent.length - 1] = currentLine.substring(0, currentLine.length - 1);
                this.currentCursorPosition.letter--;
            } else {
                if (this.currentCursorPosition.letter === 0) {
                    return;
                }

                let contentToCursorPosition = currentLine.substring(0, this.currentCursorPosition.letter - 1);
                let contentAfterCursorPosition = currentLine.substring(this.currentCursorPosition.letter);
                this.terminalContent[this.terminalContent.length - 1] = contentToCursorPosition + contentAfterCursorPosition;
                this.currentCursorPosition.letter--;
            }

            this.updateCursorPosition();
        },
        handleClockResetCommand: function (command) {
            if (command !== '4 8 15 16 23 42' || this.gameOver) {
                return;
            }

            this.clockState = 'reset|' + Math.random();
            this.systemFailureText = '';
            Utility.pushLogEntry('accepted');
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

            // idk why this needs calculations like that, but it works
            let focusLetterRect = focusLetter.getBoundingClientRect();
            let offset = (focusLetterRect.left) - (focusLetterRect.width) - (cursor.getBoundingClientRect().width / 4) - 4;
            document.getElementById('cursor').style.left = offset + 'px';
            document.getElementById('cursor').style.top = (focusLetterRect.offsetTop + (focusLetterRect.height / 2) + 4) + 'px';
        },

    },
    mounted() {
        this.focusTerminalInput();
    },
    watch: {
        clockState: function (newState) {
            newState = newState.split('|')[0];
            if (newState === 'reset' && !this.gameOver) {
                this.systemFailureText = '';
                clearInterval(this.systemFailureInterval);
                clearInterval(this.gameOverInterval);
            }
        }
    }
}
</script>
