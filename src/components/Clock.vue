<template>
    <div class="clock-frame">
        <div class="clock-container">
            <div id="clock" class="tick">
                <span data-repeat="true">
                    <span data-view="flip"></span>
                </span>
            </div>
            <div id="seconds" class="tick">
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
            mainClock: null,
            secondsClock: null,
            mainClockTimer: null,
            secondsClockTimer: null,
            secondsClockStarted: false,
            mainClockProps: {
                interval: Tick.helper.duration(60, 'seconds'),
                valuePerInterval: 1,
                dateOffset: null,
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
            let element = document.getElementById('seconds');
            this.secondsClock = Tick.DOM.create(element, {
                credits: false,
                value: this.secondsClockProps.valueOffset,
                didInit: (tick) => {
                    this.secondsClockTimer = Tick.helper.interval(() => {
                        let now = Date.now();
                        let diff = now - this.secondsClockProps.dateOffset;
                        let loops = Math.floor(diff / this.secondsClockProps.interval);
                        this.secondsClockProps.currentValue = this.secondsClockProps.valueOffset - (loops * this.secondsClockProps.valuePerInterval);
                        if (this.secondsClockProps.currentValue === -1) {
                            this.secondsClockProps.dateOffset += 60000;
                            this.secondsClockProps.currentValue = 59;
                        }

                        if (this.mainClockProps.currentValue < 4) {
                            tick.value = ('0' + this.secondsClockProps.currentValue).slice(-2);
                        } else {
                            tick.value = '00';
                        }

                    }, 1000);
                }
            });

            this.secondsClockStarted = true;
        },
        resetClock: function() {
            if (this.mainClockProps.currentValue > 4) {
                return;
            }

            this.secondsClockProps.dateOffset = Date.now();
            this.mainClockProps.dateOffset = Date.now();
        },
        startMainClock: function() {
            let element = document.getElementById('clock');
            this.mainClockProps.dateOffset = Date.now();
            this.mainClock = Tick.DOM.create(element, {
                credits: false,
                value: this.mainClockProps.valueOffset,
                didInit: (tick) => {
                    this.mainClockTimer = Tick.helper.interval(() => {
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
    },
    mounted() {
        this.startMainClock();
    },
    props: {
        clockState: String
    },
    watch: {
        clockState: function() {
            let state = this.clockState.split('|')[0];
            if (state === 'reset') {
                this.resetClock();
            }
        }
    }
}

</script>