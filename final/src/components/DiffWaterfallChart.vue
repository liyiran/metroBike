<template>
    <div>
        <h3>Count Difference for Borrow and Return by Day</h3>
        <div class="container-fluid">
            <div class="row"><div class="col-12" id="chart"><svg id="waterfall"></svg></div> </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: "DiffWaterfallChart",
        data: function () {
            var dayFields = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
            // Define dimensions
            var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            };
            var colorScale = d3.scaleSequential(d3.interpolateRdYlBu);
            var width = 1000 - margin.left - margin.right;
            var height = 800 - margin.top - margin.bottom;
            var xScale = d3.scaleBand().domain(dayFields).rangeRound([0, width]).padding(0.1);

            var yScale = d3.scaleLinear().rangeRound([height, 0]);
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
            var yAxis = d3.axisLeft(yScale);
            return {
                dayFields: dayFields,
                margin: margin,
                colorScale: colorScale,
                width: width,
                height: height,
                xScale: xScale,
                yScale: yScale,
                xAxis: xAxis,
                yAxis: yAxis,
                current:[]
            }
        },
        methods: {
            initChart(stationData) {
                // create svg element;
                var svg = d3.select("#waterfall")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g").attr("id", 'waterfall')
                    .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");
                svg.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(this.xAxis);

                var yAxisHandleForUpdate = svg.append("g")
                    .attr("class", "axis axis--y")
                    .call(this.yAxis);
                yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Difference");
                var that = this;
                this.$root.$on('change-station', (newStation) => {
                    console.log(newStation);
                    that.updateChart(stationData[newStation], yAxisHandleForUpdate, svg);
                })
            },
            updateChart(d, yAxisHandleForUpdate, svg) {
                var that = this;
                this.current = d;
                if(d3.min(d) > 0) {
                    this.yScale.domain([0,d3.max(d)]);
                } else if(d3.max(d)<0) {
                    this.yScale.domain([d3.min(d),0]); 
                } else {
                    this.yScale.domain(d3.extent(d));
                }
                
                var abs;
                console.log(this.yScale.domain());
                if (Math.abs(d3.extent(d)[0]) > Math.abs(d3.extent(d)[1])) {
                    abs = Math.abs(d3.extent(d)[0]);
                } else {
                    abs = Math.abs(d3.extent(d)[1]);
                }
                console.log(abs);
                this.colorScale.domain([-abs, abs]);
                console.log(d3.extent(d));
                yAxisHandleForUpdate.call(this.yAxis);
                var bars = svg.selectAll(".bar").data(d);
                // Add bars for new data
                bars.enter()
                    .append("rect")
                    .attr("class", function (d) {
                        if (d < 0) {
                            return "bar negative";
                        } else {
                            return "bar positive";
                        }
                    })
                    .merge(bars)
                    .attr("x", function (d, i) {
                        return that.xScale(that.dayFields[i]);
                    })
                    .attr("y", function (d) {
                        if (d < 0) {
                            return that.yScale(0);
                        } else {
                            return that.yScale(d);
                        }
                    })
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", function (d) {
                        // return that.height - that.yScale(d);
                        return Math.abs(that.yScale(d) - that.yScale(0));
                    })
                    .on("mouseover", function () {
                        d3.select(this).attr("fill", "red");
                        tooltip.style("display", null);
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition("colorfade")
                            .duration(250)
                            .attr("fill", function (d) {
                                return that.colorScale(d);
                            });

                        tooltip.style("display", "none");
                    })
                    .on("mousemove", function (d) {
                        var xPosition = d3.mouse(this)[0] - 15;
                        var yPosition = d3.mouse(this)[1] - 25;
                        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                        tooltip.select("text").text(d);
                    })
                    .attr("fill", function (d) {
                        return that.colorScale(d);
                    });

                bars.transition()
                    .delay(1500)
                    .attr("y", function (d) {
                        if (d < 0) {
                            return that.yScale(0);
                        } else {
                            return that.yScale(d);
                        }
                    })
                    .attr("height", function (d) {
                        return Math.abs(that.yScale(d) - that.yScale(0));
                    });
                // Remove old ones
                bars.exit().remove();
                // Prep the tooltip bits, initial display is hidden
                var tooltip = svg.append("g")
                    .attr("class", "info")
                    .style("display", "none");

                tooltip.append("rect")
                    .attr("width", 30)
                    .attr("height", 20)
                    .attr("fill", "white")
                    .style("opacity", 0.7);

                tooltip.append("text")
                    .attr("x", 15)
                    .attr("dy", "1.2em")
                    .style("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold");
                // // Handler for dropdown value change
            },
            onResize(event) {
                var that = this;
                var width = parseInt(d3.select('#chart').property('clientWidth')) - this.margin.left - this.margin.right;
                console.log(d3.select('#chart').property('clientWidth'));
                this.xScale.range([0, width]);
                var graph = d3.select('#waterfall');
                graph.attr('width', width + 50);
                graph.select('.axis--x')
                    .attr('transform', 'translate(0,' + this.height + ')')
                    .call(this.xAxis);
                graph.select('.xLabel')
                    .attr('x', width / 2);
                graph.selectAll('.bar')
                    .data(this.current)
                    .attr('class', 'bar')
                    .attr('x', function (d, i) { return that.xScale(that.dayFields[i]); })
                    .attr('y', function (d) {
                        if (d < 0) {
                            return that.yScale(0);
                        } else {
                            return that.yScale(d);
                        }
                    })
                    .attr('width', this.xScale.bandwidth());
            }
        },
        mounted: function () {
            var that = this;
            d3.csv("./diff.csv").then(function (data) {
                var stationData = {};
                data.forEach(function (d) {
                    var station = d.stationId;
                    stationData[station] = [];
                    //please avoid such deep function. use two fow loop
                    that.dayFields.forEach(function (field) {
                        stationData[station].push(+d[field]);
                    });
                });
                that.initChart(stationData);
                window.addEventListener('resize', that.onResize);
            });
        }
    }

</script>

<style scoped>

</style>