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
        return {}
    },
    created() {

    },
    methods: {

    },
    mounted() {
        console.log(Tick);
        // create a ticker on an element with options
        var element = document.getElementById('clock');
        var tick = Tick.DOM.create(element, {
            value: 1000,
            didInit: function(tick) {
                console.log('hello!');
                Tick.helper.interval(function() {

                    tick.value--;

                    // Set `aria-label` attribute which screenreaders will read instead of HTML content
                    tick.root.setAttribute('aria-label', tick.value);

                }, 1000);
            }
        });
    }
}

</script>