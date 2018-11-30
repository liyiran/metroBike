<template>
    <div>
        <h3>Count By Hour For Each Start Station</h3>
        <p class="alert alert-primary">This graph shows the relationship between time and bike borrow amount.</p>
        <div class="container-fluid">
            <div class="row"><div class="col-12" id="chart"><svg id="StartStationHourCount"></svg></div> </div>
        </div>
        <div id="tooltip-startbar" class="hidden">
            <p id="startbar-info">Borrow Amount</p>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: 'StartStationHourCount',
        data: function () {
            var hourFields = ["0", "1", "2", "3", "4", "5", "6", "7"
                , "8", "9", "10", "11", "12", "13", "14", "15"
                , "16", "17", "18", "19", "20", "21", "22", "23"];
            // Define dimensions
            var margin = {
                top: 50,
                right: 20,
                bottom: 30,
                left: 40
            };
            var colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 2008]);
            var width = window.innerWidth * 0.9 / 2 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;
            var xScale = d3.scaleBand().domain(hourFields).rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);
            return {
                hourFields: hourFields,
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
                var that = this;
                var canvas = d3.select("#StartStationHourCount")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g").attr("id", 'StartStationHourCount')
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

                var default_data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

                var default_bars = canvas.selectAll(".bar-start").data(default_data);
                // Add default bars 
                default_bars.enter()
                    .append("rect")
                    .attr("class", "bar-start")
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
                    .attr("fill", function (d) {
                        return that.colorScale(d);
                    }); 

                this.$root.$on('change-station', (newStation) => {
                    that.updateChart(stationData[newStation], yAxisHandleForUpdate, canvas);
                })
            },
            updateChart(d, yAxisHandleForUpdate, canvas) {
                var that = this;
                this.current = d;
                //First update the y-axis domain to match data
                this.yScale.domain([0, d3.max(d)]);
                yAxisHandleForUpdate.transition()
                    .duration(750)
                    .call(this.yAxis);
                // var bars = canvas.selectAll(".bar").data(d);
                // Add bars for new data

                var bars = d3.selectAll('.bar-start')
                    .data(d)

                bars.transition()
                    .duration(750)
                    .attr("y", function (d) {
                        return that.yScale(d);
                    })
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", function (d) {
                        return that.height - that.yScale(d);
                    })

                bars.transition("colorfade")
                    .duration(750)
                    .style("fill", function (d) {
                        return that.colorScale(d);
                    }); 

                d3.selectAll('.bar-start')
                    .on("mouseover", function (d, i) {
                        d3.select(this).style("fill", "black");
                        var xPosition = parseFloat(d3.mouse(this)[0]);
                        var yPosition = parseFloat(d3.mouse(this)[1]);
                        
                        d3.select('#tooltip-startbar')
                            .style('left', xPosition + 'px')
                            .style('top', yPosition + 'px')
                            .select('#startbar-info')
                            .html('<b>' + that.hourFields[i] + ':00 - ' + that.hourFields[i] + ':59</b> <br/>' + 'Borrowing Amount: ' + d + ' <br/>');

                            d3.select('#tooltip-startbar')
                            .classed('hidden', false) 
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition("colorfade")
                            .duration(250)
                            .style("fill", function (d) {
                                return that.colorScale(d);
                            });
                        d3.select('#tooltip-startbar')
                        .classed('hidden', true)
                    })
            },
            onResize(event) {
                var that = this;
                var width = parseInt(d3.select('#chart').property('clientWidth')) - this.margin.left - this.margin.right;
                this.xScale.range([0, width]);
                var graph = d3.select('#StartStationHourCount');
                graph.attr('width', width + 50);
                graph.select('.axis--x')
                    .attr('transform', 'translate(0,' + this.height + ')')
                    .call(this.xAxis);
                graph.select('.xLabel')
                    .attr('x', width / 2);
                graph.selectAll('.bar-start')
                    .data(this.current)
                    .attr('x', function (d, i) { return that.xScale(that.hourFields[i]); })
                    .attr('y', function (d) { return that.yScale(d); })
                    .attr('width', this.xScale.bandwidth());
            }
        },

        mounted: function () {
            var that = this;
            d3.csv("./pivot_hour_count.csv").then(function (data) {
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

<style scoped>
    #tooltip-startbar {
        position: absolute;
        width: auto;
        height: auto;
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.8);
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
        -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
        pointer-events: none;
    }
    #tooltip-startbar.hidden {
        display: none;
    }
</style>
