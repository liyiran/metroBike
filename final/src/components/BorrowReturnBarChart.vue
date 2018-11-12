<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <p>Scatter Plot</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <svg width="400" height="400" font-family="sans-serif" font-size="10" text-anchor="middle" id="scatter_plot"></svg>
            </div>
        </div>
    </div>
</template>
<!--https://medium.com/tyrone-tudehope/composing-d3-visualizations-with-vue-js-c65084ccb686-->

<script>
    import * as d3 from 'd3';

    export default {
        name: 'BorrowReturnBarChart',
        data(){
            return {
                 bar_width: 30,
                 height : 420,
                 between : 5,
                 zoom : 4,
                 bottom : 20,
                 left : 30,  
            };
        },
        methods: {
            draw_axis(d, chart_selector, xScale, yScale) {
                var svg = d3.select(chart_selector).attr("width", "100%").attr("height", this.height).append("g");
                var xAxis = d3.axisBottom(xScale);
                var yAxis = d3.axisLeft(yScale);
                svg.append("g")
                    .attr("transform", "translate(" + (this.left) + "," + (this.height - this.bottom) + ")")
                    .call(xAxis);
                svg.append("g")
                    .attr("transform", "translate(" + (this.left) + "," + (-this.bottom) + ")")
                    .call(yAxis.ticks(10));
                return svg;
            },
            draw_scatter_plot(d) {
                var xScale = d3.scalePoint().rangeRound([0, this.bar_width * d.length]).padding(0.5).domain(d.map(function (o) {
                    return o.country_code;
                }));
                var yScale = d3.scaleLinear().rangeRound([this.height, 0]).domain([0, 100]);

                var svg = this.draw_axis(d, "#scatter_plot", xScale, yScale);
                var r = 3.5;

                var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                // draw dots
                let that = this;
                svg.selectAll(".dot")
                    .data(d)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", r)
                    .attr("cx", function (d) {
                        return xScale(d.country_code) + that.left;
                    })
                    .attr("cy", function (d) {
                        return yScale(d.population) - that.bottom;
                    })
                    .style("fill", "black")
                    .on("mouseover", function () {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(d["country_name"] + "<br/> (" + d.population + "%)")
                            .style("left", (d3.event.pageX + 5) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

            },
            createChart() {
                let that = this;
                d3.json('./data.json').then(function (d) {
                    that.draw_scatter_plot(d);
                })
            },
        },
        mounted: function () {
            this.createChart();  
        }
    }

</script>