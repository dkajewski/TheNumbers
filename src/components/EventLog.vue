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
                            <div v-for="(logEntry, i) in eventLog.slice((currentPage - 1) * perPage , currentPage * perPage)">
                                <span>{{ (i + 1) + ((currentPage - 1) * perPage) }}.</span>&nbsp;
                                <span>{{ logEntry.timestamp }}</span>&nbsp;
                                <span>{{ logEntry.message }}</span>
                            </div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <div>
                                <button v-on:click="currentPage--" :disabled="currentPage === 1">Previous</button>
                                <button v-on:click="currentPage++" :disabled="currentPage === Math.ceil(getRowsCount() / perPage)">Next</button>
                            </div>
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
            eventLog: [],
            perPage: 5,
            currentPage: 1,
        }
    },
    methods: {
        getRowsCount: function () {
            return this.eventLog.length;
        },
    },
    mounted() {
        this.eventLog = Storage.get('eventLog');
    },
}
</script>
