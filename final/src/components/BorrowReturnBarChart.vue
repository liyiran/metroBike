<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <p>山寨1</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <svg width="400" height="400" font-family="sans-serif" font-size="10" text-anchor="middle" id="test_chart"></svg>
            </div>
        </div>
    </div>
</template>
<!--https://medium.com/tyrone-tudehope/composing-d3-visualizations-with-vue-js-c65084ccb686-->

<script>
    import * as d3 from 'd3';
    export default {
    name: 'HelloWorld',
    methods: {
        createChart() {
            d3.select("#test_chart").append("rect").attr("height", 80).attr("width", 10);
        } ,
    },
    mounted() {
        this.createChart();
    }    
    }
   
</script>