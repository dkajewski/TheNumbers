<template>
    <div class="clock-container">
        <div v-for="n in 5" :id="'hieroglyph' + n" class="tick system-failure">
            <span data-view="flip"></span>
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
        }
    },
    props: {
        systemFailureActive: Boolean,
        systemFailureTime: Number,
    },
    methods: {
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
        this.setupSystemFailureClock();
    }
}
</script>
