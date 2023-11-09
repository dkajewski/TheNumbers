<template>
    <div class="monitor">
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
            terminalContent: ['> hello world'],
        }
    },
    created() {
        window.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'Enter') {
                this.executeCommand();
            }

            if (e.key === 'Backspace') {
                this.deleteLastCharacter();
            }

            if (e.key.length === 1) {
                this.updateCurrentCommandLine(e.key);
            }
        });
    },
    methods: {
        executeCommand: function() {
            this.terminalContent.push('');
        },
        updateCurrentCommandLine: function(key) {
            if (this.terminalContent.length === 0) {
                this.terminalContent.push('');
            }

            this.terminalContent[this.terminalContent.length - 1] += key;
        },
        deleteLastCharacter: function() {
            if (this.terminalContent.length === 0) {
                return;
            }

            this.terminalContent[this.terminalContent.length - 1] = this.terminalContent[this.terminalContent.length - 1].slice(0, -1);
        }
    }
}
</script>