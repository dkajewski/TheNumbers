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
                            <div v-for="(logEntry, i) in eventLog.slice((currentPage - 1) * perPage , currentPage * perPage)" class="event-row">
                                <span>{{ (i + 1) + ((currentPage - 1) * perPage) }}.</span>&nbsp;
                                <span>{{ logEntry.timestamp }}</span>&nbsp;
                                <span>{{ logEntry.message }}</span>
                            </div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <div class="pagination-buttons">
                                <button v-on:click="currentPage--" :disabled="currentPage === 1">&lt;&lt;</button>
                                <button v-on:click="currentPage++" :disabled="currentPage === Math.ceil(getRowsCount() / perPage)">&gt;&gt;</button>
                            </div>
                            <div class="modal-default-button" v-on:click="$emit('close')">Close</div>
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
            perPage: 8,
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
