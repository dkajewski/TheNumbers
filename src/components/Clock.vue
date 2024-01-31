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
            secondsClock: {
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

            this.secondsClock.dateOffset = Date.now();
            let element = document.getElementById('minutes');
            Tick.DOM.create(element, {
                value: this.secondsClock.valueOffset,
                didInit: (tick) => {
                    Tick.helper.interval(() => {
                        let now = Date.now();
                        let diff = now - this.secondsClock.dateOffset;
                        let loops = Math.floor(diff / this.secondsClock.interval);
                        this.secondsClock.currentValue = this.secondsClock.valueOffset - (loops * this.secondsClock.valuePerInterval);
                        if (this.secondsClock.currentValue === -1) {
                            this.secondsClock.dateOffset += 60000;
                            this.secondsClock.currentValue = 59;
                        }

                        if (this.mainClockProps.currentValue < 5) {
                            tick.value = ('0' + this.secondsClock.currentValue).slice(-2);
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