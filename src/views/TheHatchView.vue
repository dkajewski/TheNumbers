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
                                <span v-for="(letter, i) in getStringAsArray(index)" v-bind:id="`line-${index}-letter-${i}`">
                                    {{ letter }}
                                </span><span
                                        v-bind:class="{'terminal-cursor': !typingActive}"
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
        }
    },
    created() {
        window.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'Enter') {
                this.executeCommand();
            }

            this.typingActive = true;
            this.lastTypedKeyTimestamp = Date.now();
        });

        setInterval(this.toggleCursorAnimationModel, 1000);
    },
    methods: {
        executeCommand: function() {
            this.terminalContent.push(this.terminalInput);
            this.terminalInput = '';
        },
        focusTerminalInput: function() {
            this.$refs.terminalInput.focus();
        },
        getStringAsArray: function(lineIndex) {
            return this.terminalContent[lineIndex].split('');
        },
        updateCurrentCommandLine: function() {
            if (this.terminalContent.length === 0) {
                this.terminalContent.push(this.terminalInput);
            }

            this.terminalContent[this.terminalContent.length - 1] = this.terminalInput;
        },
        toggleCursorAnimationModel: function() {
            if (Date.now() - this.lastTypedKeyTimestamp > 100) {
                this.typingActive = false;
            }
        }
    },
    mounted() {
        this.focusTerminalInput();
    },
    watch: {
        terminalInput: function() {
            this.updateCurrentCommandLine();
        }
    }
}
</script>