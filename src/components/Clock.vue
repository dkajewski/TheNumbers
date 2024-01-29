<template>
    <div id="clock" class="tick">
        <span data-repeat="true">
            <span data-view="flip"></span>
        </span>
    </div>
</template>
<script>
import Tick from '@pqina/flip';

export default {
    data() {
        return {
            mainClockProps: {
                interval: Tick.helper.duration(60, 'seconds'),
                valuePerInterval: 1,
                dateOffset: Date.now(),
                valueOffset: 108,
            },
        }
    },
    created() {

    },
    methods: {

    },
    mounted() {
        let element = document.getElementById('clock');
        Tick.DOM.create(element, {
            value: this.mainClockProps.valueOffset,
            didInit: (tick) => {
                Tick.helper.interval(() => {
                    let now = Date.now();
                    let diff = now - this.mainClockProps.dateOffset;
                    let loops = Math.floor(diff / this.mainClockProps.interval);
                    tick.value = this.mainClockProps.valueOffset - (loops * this.mainClockProps.valuePerInterval);
                }, 1000);
            }
        });
    }
}

</script>