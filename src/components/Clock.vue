<template>
    <div class="clock-frame">
        <div class="clock-container">
            <div id="clock" class="tick">
                <span data-repeat="true">
                    <span data-view="flip"></span>
                </span>
            </div>
            <div id="minutes" class="tick">
                <span data-repeat="true" id="light-flip">
                    <span data-view="flip"></span>
                </span>
            </div>
        </div>
    </div>

</template>
<script>
import Tick from '@pqina/flip';

export default {
    data() {
        return {
            secondsClockStarted: false,
            mainClockProps: {
                interval: Tick.helper.duration(60, 'seconds'),
                valuePerInterval: 1,
                dateOffset: Date.now(),
                valueOffset: 108,
                currentValue: 108,
            },
            secondsClockProps: {
                interval: Tick.helper.duration(1, 'seconds'),
                dateOffset: null,
                valuePerInterval: 1,
                currentValue: 59,
                valueOffset: 59,
            }
        }
    },
    created() {

    },
    methods: {
        startSecondsClock: function() {
            if (this.secondsClockStarted) {
                return;
            }

            this.secondsClockProps.dateOffset = Date.now();
            let element = document.getElementById('minutes');
            Tick.DOM.create(element, {
                credits: false,
                value: this.secondsClockProps.valueOffset,
                didInit: (tick) => {
                    Tick.helper.interval(() => {
                        let now = Date.now();
                        let diff = now - this.secondsClockProps.dateOffset;
                        let loops = Math.floor(diff / this.secondsClockProps.interval);
                        this.secondsClockProps.currentValue = this.secondsClockProps.valueOffset - (loops * this.secondsClockProps.valuePerInterval);
                        if (this.secondsClockProps.currentValue === -1) {
                            this.secondsClockProps.dateOffset += 60000;
                            this.secondsClockProps.currentValue = 59;
                        }

                        if (this.mainClockProps.currentValue < 5) {
                            tick.value = ('0' + this.secondsClockProps.currentValue).slice(-2);
                        } else {
                            tick.value = '00';
                        }

                    }, 1000);
                }
            });

            this.secondsClockStarted = true;
        }
    },
    mounted() {
        let element = document.getElementById('clock');
        Tick.DOM.create(element, {
            credits: false,
            value: this.mainClockProps.valueOffset,
            didInit: (tick) => {
                Tick.helper.interval(() => {
                    let now = Date.now();
                    this.startSecondsClock();
                    let diff = now - this.mainClockProps.dateOffset;
                    let loops = Math.floor(diff / this.mainClockProps.interval);
                    this.mainClockProps.currentValue = this.mainClockProps.valueOffset - (loops * this.mainClockProps.valuePerInterval);
                    tick.value = ('00' + this.mainClockProps.currentValue).slice(-3);
                }, 1000);
            }
        });
    }
}

</script>