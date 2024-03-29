<template>
    <div>
        <div class="clock-frame" v-show="!systemFailureActive">
            <div class="clock-container">
                <div id="clock" class="tick">
                    <span data-repeat="true">
                        <span data-view="flip"></span>
                    </span>
                </div>
                <div id="seconds" class="tick">
                    <span data-repeat="true" class="light-flip">
                        <span data-view="flip"></span>
                    </span>
                </div>
            </div>
        </div>
        <div class="clock-frame" v-show="systemFailureActive">
            <div class="clock-container">
                <div v-for="n in 5" :id="'hieroglyph' + n" class="tick system-failure">
                    <span data-view="flip"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Tick from '@pqina/flip';

export default {
    data() {
        return {
            hieroglyphs: [
                '\u{132f4}',
                '\u{133f2}',
                '\u{13352}',
                '\u{13142}',
                '\u{133f1}',
            ],
            hieroglyphsClocks: [],
            hieroglyphsTimers: [],
            hieroglyphsStopSec: {
                1: 11,
                2: 15,
                3: 7,
                4: 6,
                5: 9
            },
            mainClock: null,
            mainClockTimer: null,
            mainClockProps: {
                interval: Tick.helper.duration(60, 'seconds'),
                valuePerInterval: 1,
                dateOffset: null,
                valueOffset: 0,
                currentValue: 0,
            },
            mainClockTick: null,
            secondsAfterSystemFailureStart: 0,
            secondsClock: null,
            secondsClockProps: {
                interval: Tick.helper.duration(1, 'seconds'),
                dateOffset: null,
                valuePerInterval: 1,
                currentValue: 14,
                valueOffset: 14,
            },
            secondsClockStarted: false,
            secondsClockTimer: null,
            secondsTick: null,
            systemFailureActive: false,
            systemFailureInterval: null,
            systemFailureTime: null,
        }
    },
    created() {

    },
    methods: {
        systemFailure: function () {
            if (this.systemFailureActive) {
                return;
            }

            this.systemFailureTime = Date.now() - (this.secondsAfterSystemFailureStart > 1 ? (this.secondsAfterSystemFailureStart * 1000) : 0);
            this.systemFailureActive = true;
            this.secondsAfterSystemFailureStart = 0;
            this.$emit('system-failure', true);
            this.setSystemFailureTimerValues();
        },
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
                    this.secondsTick = tick;
                    this.secondsClockTimer = Tick.helper.interval(() => {
                        let now = Date.now();
                        let diff = now - this.secondsClockProps.dateOffset;
                        let loops = Math.floor(diff / this.secondsClockProps.interval);
                        this.secondsClockProps.currentValue = this.secondsClockProps.valueOffset - (loops * this.secondsClockProps.valuePerInterval);
                        if (this.secondsClockProps.currentValue <= -1) {
                            this.secondsAfterSystemFailureStart = Math.abs(this.secondsClockProps.currentValue);
                            if (this.mainClockProps.currentValue === 0) {
                                this.secondsClockTimer.stop();
                                this.secondsClockProps.currentValue = 0;
                                this.systemFailure();
                            } else {
                                this.secondsClockProps.dateOffset += 60000;
                                this.secondsClockProps.currentValue = 59;
                            }
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

            clearInterval(this.systemFailureInterval);
            this.secondsClockProps.dateOffset = Date.now();
            this.mainClockProps.dateOffset = Date.now();
            this.secondsClockTimer.reset();
            this.systemFailureActive = false;
        },
        startMainClock: function() {
            let element = document.getElementById('clock');
            this.mainClockProps.dateOffset = Date.now();
            this.mainClock = Tick.DOM.create(element, {
                credits: false,
                value: this.mainClockProps.valueOffset,
                didInit: (tick) => {
                    this.mainClockTick = tick;
                    this.mainClockTimer = Tick.helper.interval(() => {
                        let now = Date.now();
                        this.startSecondsClock();
                        let diff = now - this.mainClockProps.dateOffset;
                        let loops = Math.floor(diff / this.mainClockProps.interval);
                        this.mainClockProps.currentValue = Math.max(this.mainClockProps.valueOffset - (loops * this.mainClockProps.valuePerInterval), 0);
                        tick.value = ('00' + this.mainClockProps.currentValue).slice(-3);
                    }, 1000);
                }
            });


        },
        setSystemFailureTimerValues: function () {
            this.systemFailureInterval = setInterval(() => {
                this.secondsTick.value = Math.floor(Math.random() * 90 + 10);
                this.mainClockTick.value = Math.floor(Math.random() * 899 + 100);
            }, 100);
        },
        setupSystemFailureClock: function () {
            for (let i = 1; i <= 5; i++) {
                let element = document.getElementById('hieroglyph' + i);
                this.hieroglyphsTimers[i] = Tick.DOM.create(element, {
                    credits: false,
                    value: this.hieroglyphs[Math.floor(Math.random()*this.hieroglyphs.length)],
                    didInit: (tick) => {
                        Tick.helper.interval(() => {
                            if (!this.systemFailureActive) {
                                return;
                            }

                            let digit = tick._element.id.slice(-1);
                            let now = Date.now();
                            this.startSecondsClock();
                            let diff = (now - this.systemFailureTime) / 1000;
                            if (diff >= this.hieroglyphsStopSec[digit]) {
                                tick.value = this.hieroglyphs[digit-1];
                            } else {
                                tick.value = this.hieroglyphs[Math.floor(Math.random()*this.hieroglyphs.length)];
                            }
                        }, 100);
                    }
                });
            }
        },
    },
    mounted() {
        this.startMainClock();
        this.setupSystemFailureClock();
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