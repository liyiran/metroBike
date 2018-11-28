<template>
    <div>
        <h3>Count By Hour For Each Return Station</h3>
        <div class="container-fluid">
            <div class="row"><div class="col-12" id="chart"><svg id="EndStationHourCount"></svg></div> </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: 'EndStationHourCount',
        data: function () {
            var hourFields = ["0", "1", "2", "3", "4", "5", "6", "7"
                , "8", "9", "10", "11", "12", "13", "14", "15"
                , "16", "17", "18", "19", "20", "21", "22", "23"];
            // Define dimensions
            var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            };
            var colorScale = d3.scaleSequential(d3.interpolateYlOrRd);
            var width = 1000 - margin.left - margin.right;
            var height = 600 - margin.top - margin.bottom;
            var xScale = d3.scaleBand().domain(hourFields).rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);
            return {
                hourFields: hourFields,
                margin: margin,
                colorScale:colorScale,
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
                // console.log(stationData);
                var canvas = d3.select("#EndStationHourCount")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g").attr("id", 'EndStationHourCount')
                    .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");
                canvas.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(this.xAxis);
                var yAxisHandleForUpdate = canvas.append("g")
                    .attr("class", "axis axis--y")
                    .call(this.yAxis);
                yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Amount");
                var that = this;
                this.$root.$on('change-station', (newStation) => {
                    console.log(newStation);
                    that.updateChart(stationData[newStation],yAxisHandleForUpdate,canvas);
                })
            },
            updateChart(d, yAxisHandleForUpdate, canvas) {
                var that = this;
                this.current = d;
                //First update the y-axis domain to match data
                this.yScale.domain(d3.extent(d));
                this.colorScale.domain(d3.extent(d));
                yAxisHandleForUpdate.call(this.yAxis);
                var bars = canvas.selectAll(".bar").data(d);
                // Add bars for new data
                bars.enter()
                    .append("rect")
                    .attr("class", "bar")
                    .merge(bars)
                    .attr("x", function (d, i) {
                        return that.xScale(that.hourFields[i]);
                    })
                    .attr("y", function (d) {
                        return that.yScale(d);
                    })
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", function (d) {
                        return that.height - that.yScale(d);
                    })
                    .on("mouseover", function () {
                        d3.select(this).attr("fill", "red");
                        tooltip.style("display", null);
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition("colorfade")
                            .duration(250)
                            .attr("fill", function(d){
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
                    .attr("fill", function(d){

                        return that.colorScale(d);
                    });
                // Update old ones, already have x / width from before
                bars.transition()
                    .delay(1500)
                    .attr("y", function (d) {
                        return that.yScale(d);
                    })
                    .attr("height", function (d) {
                        return that.height - that.yScale(d);
                    });
                // Remove old ones
                bars.exit().remove();
                // Prep the tooltip bits, initial display is hidden
                var tooltip = canvas.append("g")
                    .attr("class", "info")
                    .style("display", "none");

                tooltip.append("rect")
                    .attr("width", 30)
                    .attr("height", 20)
                    .attr("fill", "white")
                    .style("opacity", 0.5);

                tooltip.append("text")
                    .attr("x", 15)
                    .attr("dy", "1.2em")
                    .style("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold");
                // // Handler for dropdown value change
            },
            onResize(event){
                var that = this;
                var width = parseInt(d3.select('#chart').property('clientWidth')) - this.margin.left - this.margin.right;
                console.log(d3.select('#chart').property('clientWidth'));
                this.xScale.range([0, width]);
                var graph = d3.select('#EndStationHourCount');
                graph.attr('width', width + 50);
                graph.select('.axis--x')
                    .attr('transform', 'translate(0,' + this.height + ')')
                    .call(this.xAxis);
                graph.select('.xLabel')
                    .attr('x', width/2);
                graph.selectAll('.bar')
                    .data(this.current)
                    .attr('class', 'bar')
                    .attr('x', function(d,i){ return that.xScale(that.hourFields[i]); })
                    .attr('y', function(d){ return that.yScale(d); })
                    .attr('width', this.xScale.bandwidth());
            }
        },

        mounted: function () {
            var that = this;
            d3.csv("./pivot_hour_count_end.csv").then(function (data) {
                var stationData = {};
                data.forEach(function (d) {
                    var station = d.station_id;
                    stationData[station] = [];
                    //please avoid such deep function. use two fow loop
                    that.hourFields.forEach(function (field) {
                        stationData[station].push(+d[field]);
                    });
                });
                that.initChart(stationData);
                window.addEventListener('resize', that.onResize);
            });

        }
    }
</script>