<template>
    <div class="not-visible">
        <textarea id="terminal-input" ref="terminalInput" v-model="terminalInput"></textarea>
    </div>
    <div class="monitor" @click="focusTerminalInput()">
        <!-- todo: frame looks awful, it needs to look nice -->
        <div class="outer-frame">
            <div class="inner-frame">
                <div class="screen">
                    <div v-for="line in terminalContent">
                        {{ line }}
                    </div>
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
            terminalContent: ['> hello world'],
        }
    },
    created() {
        window.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
    },
    methods: {
        executeCommand: function() {
            this.terminalContent.push(this.terminalInput);
            this.terminalInput = '';
        },
        focusTerminalInput: function() {
            this.$refs.terminalInput.focus();
        },
        updateCurrentCommandLine: function() {
            if (this.terminalContent.length === 0) {
                this.terminalContent.push(this.terminalInput);
            }

            this.terminalContent[this.terminalContent.length - 1] = this.terminalInput;
        },
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