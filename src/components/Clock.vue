<script setup>
import SystemFailureClock from "./SystemFailureClock.vue";
</script>
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
            <SystemFailureClock v-bind:system-failure-active="systemFailureActive" v-bind:system-failure-time="systemFailureTime"/>
        </div>
    </div>
</template>
<script>
import Tick from '@pqina/flip';
import LocalStorage from "../helpers/localStorage";

export default {
    data() {
        return {
            mainClock: null,
            mainClockTimer: null,
            mainClockProps: {
                interval: Tick.helper.duration(60, 'seconds'),
                valuePerInterval: 1,
                dateOffset: null,
                valueOffset: 1,
                currentValue: 1,
            },
            mainClockTick: null,
            secondsAfterSystemFailureStart: 0,
            secondsClock: null,
            secondsClockProps: {
                interval: Tick.helper.duration(1, 'seconds'),
                dateOffset: null,
                valuePerInterval: 1,
                currentValue: 59,
                valueOffset: 59,
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
        getClockStartDate: function () {
            let clockStartDate = LocalStorage.get('clockStartDate') !== null ? new Date(Date.parse(LocalStorage.get('clockStartDate'))) : new Date();
            LocalStorage.set('clockStartDate', clockStartDate);

            return clockStartDate.getTime();
        },
        setClockStartDate: function (date) {
            LocalStorage.set('clockStartDate', date);
        },
        getSecondsClockStartValue: function () {
            let clockStartDate = LocalStorage.get('secondsClockStartDate') !== null ? new Date(Date.parse(LocalStorage.get('secondsClockStartDate')) + 1) : new Date();
            LocalStorage.set('secondsClockStartDate', clockStartDate);

            return clockStartDate.getTime();
        },
        setSecondsClockStartValue: function (date) {
            LocalStorage.set('secondsClockStartDate', date);
        },
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

            this.secondsClockProps.dateOffset = this.getSecondsClockStartValue();
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
                        console.log(this.secondsClockProps.valueOffset, loops, this.secondsClockProps.valuePerInterval);
                        if (this.secondsClockProps.currentValue <= -1) {
                            this.secondsAfterSystemFailureStart = Math.abs(this.secondsClockProps.currentValue);
                            if (this.mainClockProps.currentValue === 0) {
                                this.secondsClockTimer.stop();
                                this.secondsClockProps.currentValue = 0;
                                this.systemFailure();
                            } else {
                                this.secondsClockProps.dateOffset += 60000;
                                LocalStorage.set('secondsClockStartDate', new Date(this.secondsClockProps.dateOffset));
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
            let nowTs = Date.now();
            let now = new Date(nowTs);
            this.setClockStartDate(now);
            this.setSecondsClockStartValue(now);
            this.secondsClockProps.dateOffset = nowTs;
            this.mainClockProps.dateOffset = nowTs + 100;
            this.secondsClockTimer.reset();
            this.systemFailureActive = false;
        },
        startMainClock: function() {
            let element = document.getElementById('clock');
            this.mainClockProps.dateOffset = this.getClockStartDate();
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