<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            Event Log
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <div v-for="logEntry in eventLog">
                                <span>{{ logEntry.timestamp }}</span>&nbsp;
                                <span>{{ logEntry.message }}</span>
                            </div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button" v-on:click="$emit('close')">OK</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import Storage from "../helpers/storage";

export default {
    data() {
        return {
            eventLog: []
        }
    },
    methods: {
    },
    mounted() {
        this.eventLog = Storage.get('eventLog');
    },
}
</script>
