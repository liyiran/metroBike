<template>
    <div>
        <br/>
        <!-- <h3>Count Difference for Borrow and Return by Day</h3> -->
        <div class="container-fluid">
            <div class="row">
                <!-- <p class="alert alert-primary">This graph shows the difference between borrow and return rate. 
                    If a station has too many borrow rate but too little return rate, the compnay has to use a truck to carry bikes from other stations and fill this station.</p> -->
                <div class="col-12" id="chart-waterfall">
                    <svg id="waterfall">
                    </svg>
                </div> </div>
        </div>
        <div id="tooltip-dif" class="hidden">
            <p id="dif-info">Borrow-Return Difference</p>
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
                top: 40,
                right: 30,
                bottom: 40,
                left: 40
            };
            var colorScale = d3.scaleSequential(d3.interpolateRdYlBu);
            var width = window.innerWidth *0.95 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;
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

                svg.append('text')
                    .attr('id', 'xAxis-title-dif')
                    .attr("x", this.width / 2)
                    .attr("y", this.height + 30)
                    .attr("text-anchor", "middle")
                    .attr('font-size', 11)
                    .text("Days in a Month");

                var yAxisHandleForUpdate = svg.append("g")
                    .attr("class", "axis axis--y")
                    .call(this.yAxis);

                svg.append('text')
                    .attr("x", - 95)
                    .attr("y", - 30)
                    .attr("transform", "rotate(-90)")
                    .attr('font-size', 11)
                    .text("Average Difference");

                yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Difference");

                svg.append('text')
                    .attr('id', 'title-dif')
                    .attr("x", this.width / 2)
                    .attr("y", - 10)
                    .attr("text-anchor", "middle")
                    .attr('font-size', 20)
                    .text("Borrow-Return Difference");

                var that = this;

                var default_data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                this.colorScale.domain([-1,1])
                // this.yScale.domain([-1,1])

                var default_bars = svg.selectAll(".bar-dif").data(default_data);
                // Add default bars 
                default_bars.enter()
                    .append("rect")
                    .attr("class", "bar-dif")
                    .attr("x", function (d, i) {
                        return that.xScale(that.dayFields[i]);
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
                
                svg.append('line')
                    .attr('id', 'line-0')
                    .attr('x1', 0)
                    .attr('y1', this.yScale('0'))
                    .attr('x2', this.width)
                    .attr('y2', this.yScale('0'))
                    .attr('stroke', 'black')
                    .attr('stroke-width', '1px')
                    .attr('stroke-dasharray', "5,5")

                this.$root.$on('change-station', (newStation) => {
                    // console.log(newStation);
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
                // console.log(this.yScale.domain());
                if (Math.abs(d3.extent(d)[0]) > Math.abs(d3.extent(d)[1])) {
                    abs = Math.abs(d3.extent(d)[0]);
                } else {
                    abs = Math.abs(d3.extent(d)[1]);
                }
                // console.log(abs);
                this.colorScale.domain([-abs, abs]);
                // console.log(d3.extent(d));
                yAxisHandleForUpdate.transition().duration(750).call(this.yAxis);

                var line = d3.select('#line-0')
                line.transition()
                    .duration(750)
                    .attr('y1', this.yScale('0'))
                    .attr('y2', this.yScale('0'))

                var bars = d3.selectAll(".bar-dif")
                    .data(d);

                bars.transition()
                    .duration(750)
                    .attr("y", function (d) {
                        // return that.yScale(d);
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

                bars.transition("colorfade")
                    .duration(750)
                    .style("fill", function (d) {
                        return that.colorScale(d);
                    }); 

                d3.selectAll('.bar-dif')
                    .on("mouseover", function (d, i) {
                        d3.select(this).style("fill", "black");
                        var xPosition = parseFloat(d3.mouse(this)[0]);
                        var yPosition = parseFloat(d3.mouse(this)[1]);
                        
                        d3.select('#tooltip-dif')
                            .style('left', xPosition + 'px')
                            .style('top', (yPosition) + 'px')
                            // .style("left", (d3.event.pageX) + "px")
                            // .style("top", (d3.event.pageY - 757) + "px")
                            .select('#dif-info')
                            .html('Borrow-Return Difference: ' + d);

                            d3.select('#tooltip-dif')
                            .classed('hidden', false) 
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition("colorfade")
                            .duration(250)
                            .style("fill", function (d) {
                                return that.colorScale(d);
                            });
                        d3.select('#tooltip-dif')
                        .classed('hidden', true)
                    })
            },
            onResize(event) {
                try{
                var that = this;
                var width = parseInt(d3.select('#chart-waterfall').property('clientWidth')) - this.margin.left - this.margin.right;
                // console.log(d3.select('#chart-waterfall').property('clientWidth'));
                this.xScale.range([0, width]);
                var graph = d3.select('#waterfall');
                graph.attr('width', width + 50);
                graph.select('.axis--x')
                    .attr('transform', 'translate(0,' + this.height + ')')
                    .call(this.xAxis);
                graph.select('#xAxis-title-dif')
                    .attr('x', width / 2);
                graph.select('#title-dif')
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
                    .attr('width', this.xScale.bandwidth());   }
                    catch (e) {
                        console.log("SB le")
                    }
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
    #tooltip-dif {
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
    #tooltip-dif.hidden {
        display: none;
    }

</style>