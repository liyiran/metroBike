<template>
    <div class="container">
        <!-- <h3>Time history for bike usage</h3> -->
        <div class="row">
            <div class="col">
                <!-- <p class="alert alert-info">Move your mouse on the lines to see more details.</p> -->
                <div class="alert alert-info">
                    Moving mouse over the lines to see more details.
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <div style="min-height: 600px;">
                    <svg id="line">
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: "AverageMonthLineChart",

        methods: {
            initChart() {
                d3.json("./averageMonthLine.json").then(function (dataset) {

                    var color = d3.scaleOrdinal(d3.schemeCategory10)

                    var data = dataset
                    var margin = {top: 20, right: 170, bottom: 60, left: 40},
                        width = parseInt(d3.select("#line").style("width")) - margin.left - margin.right,
                        height = parseInt(d3.select("#line").style("height")) - margin.top - margin.bottom;

                    var lineOpacity = "1";
                    var lineOpacityHover = "0.8";
                    var otherLinesOpacityHover = "0.2";
                    var lineStroke = "2.5px";
                    var lineStrokeHover = "4.5px";
                    var circleRadius = 6;

                    /* Format Data */
                    var parseDate = d3.timeParse("%b-%y");

                    data.forEach(function (d) {
                        d.values.forEach(function (d) {
                            d.date = parseDate(d.date);
                            d.amount = +d.amount;
                        });
                    });

                    /* Scale */
                    var xScale = d3.scaleTime()
                        .domain(d3.extent(data[0].values, function (d) {
                            return d.date
                        }))
                        .range([0, width]);

                    var yScale = d3.scaleLinear()
                        .domain([0, 400])
                        .range([height, 0]);

                    /* Add SVG */
                    var svg = d3.select("#line")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    /* Add line into SVG */
                    var line = d3.line()
                        .x(function (d) {
                            return xScale(d.date)
                        })
                        .y(function (d) {
                            return yScale(d.amount)
                        });

                    let lines = svg.append('g')
                        .attr('class', 'lines');


                    var points = lines.selectAll("circle-group")
                        .data(data).enter()
                        .append("g")
                        .attr("class", function (d) {
                            return d.name;
                        })
                        .style("fill", function (d, i) {
                            return color(i);
                        })
                        .selectAll("circle")
                        .data(function (d) {
                            return d.values
                        }).enter()

                    points.append("g")
                        .append("circle")
                        .attr("class", "circle")
                        .attr("cx", function (d) {
                            return xScale(d.date);
                        })
                        .attr("cy", function (d) {
                            return yScale(d.amount);
                        })
                        .attr("r", circleRadius)
                        .style("display", "none");

                    points.append("g")
                        .append("text")
                        .attr("class", "circle-text")
                        .attr("x", function (d) {
                            return xScale(d.date);
                        })
                        .attr("y", function (d) {
                            return yScale(d.amount) - 10;
                        })
                        .attr("fill", "black")
                        .text(function (d) {
                            return d.amount;
                        })
                        .style("display", "none");

                    //add Vertical Legend//////////////////////////
                    var legend = svg
                        .append('g')
                        .attr("class", "legend")
                        .attr("transform", "translate(" + (width + 60) + ",0)")
                        .selectAll('.legend')
                        .data(data)
                        .enter().append('g')
                        .attr("class", function (d) {
                            return d.name;
                        })
                        .attr("transform", function (d, i) {
                            return "translate( 0 ," + i * 20 + ")"
                        });

                    legend.append('rect')
                        .attr("class", "legend-rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", function (d, i) {
                            return color(i)
                        });

                    legend.append('text')
                        .attr("x", 20)
                        .attr("y", 10)
                        .text(function (d, i) {
                            return d.name;
                        })
                        .attr("class", "legend-text")
                        .style("text-anchor", "start")
                        .style("font-size", 15);

                    // draw lines
                    lines.selectAll('.line-group')
                        .data(data).enter()
                        .append('g')
                        .attr('class', function (d) {
                            return d.name;
                        })
                        .append('path')
                        .attr('class', 'line')
                        .attr('d', function (d) {
                            return line(d.values)
                        })
                        .style('stroke', function (d, i) {
                            return color(i)
                        })
                        .style("stroke-width", lineStroke)
                        .style('fill', 'none')
                        .style('opacity', lineOpacity)
                        .on("mouseover", function (d, i) {
                            d3.selectAll('.line')
                                .style('opacity', otherLinesOpacityHover);
                            d3.select(this)
                                .style('opacity', lineOpacityHover)
                                .style("stroke-width", lineStrokeHover)
                                .style("cursor", "pointer");

                            d3.selectAll(".legend-text")
                                .style('opacity', otherLinesOpacityHover);
                            d3.selectAll(".legend-rect")
                                .style('opacity', otherLinesOpacityHover);

                            d3.selectAll("." + d.name).selectAll(".legend-text")
                                .style('opacity', lineOpacity);
                            d3.selectAll("." + d.name).selectAll(".legend-rect")
                                .style('opacity', lineOpacityHover);


                            d3.selectAll("." + d.name).selectAll(".circle").style("display", "initial");

                            d3.selectAll("." + d.name).selectAll(".circle-text").style("display", "initial");
                        })
                        .on("mouseout", function (d) {
                            d3.selectAll(".line")
                                .style('opacity', lineOpacity);
                            d3.select(this)
                                .style("stroke-width", lineStroke)
                                .style("cursor", "none");

                            d3.selectAll(".legend-text")
                                .style('opacity', lineOpacity);
                            d3.selectAll(".legend-rect")
                                .style('opacity', lineOpacity);

                            d3.selectAll("." + d.name).selectAll(".circle").style("display", "none");

                            d3.selectAll("." + d.name).selectAll(".circle-text").style("display", "none");
                        });


                    legend.on("mouseover", function (d) {
                        d3.selectAll('.line')
                            .style('opacity', otherLinesOpacityHover);
                        d3.selectAll('.' + d.name)
                            .selectAll('.line')
                            .style('opacity', lineOpacityHover)
                            .style("stroke-width", lineStrokeHover)
                            .style("cursor", "pointer");

                        d3.selectAll(".legend-text")
                            .style('opacity', otherLinesOpacityHover);
                        d3.selectAll(".legend-rect")
                            .style('opacity', otherLinesOpacityHover);
                        d3.selectAll("." + d.name).selectAll(".legend-text")
                            .style('opacity', lineOpacity);
                        d3.selectAll("." + d.name).selectAll(".legend-rect")
                            .style('opacity', lineOpacityHover);

                        d3.selectAll("." + d.name).selectAll(".circle").style("display", "initial");

                        d3.selectAll("." + d.name).selectAll(".circle-text").style("display", "initial");
                    })
                        .on("mouseout", function (d) {
                            d3.selectAll(".line")
                                .style('opacity', lineOpacity);
                            d3.selectAll("." + d.name).selectAll(".circle").style("display", "none");

                            d3.selectAll(".legend-text")
                                .style('opacity', lineOpacity);
                            d3.selectAll(".legend-rect")
                                .style('opacity', lineOpacity);


                            d3.selectAll("." + d.name).selectAll(".circle-text").style("display", "none");

                            d3.selectAll("." + d.name).selectAll(".line").style("stroke-width", lineStroke)
                                .style("cursor", "none");

                        });

                    /* Add Axis into SVG */
                    var xAxis = d3.axisBottom(xScale).ticks(24);
                    var yAxis = d3.axisLeft(yScale).ticks(9);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate( 0," + height + ")")
                        .call(xAxis)
                        .selectAll('text')
                        //   .attr("y", 9)
                        .attr("x", 9)
                        .attr("transform", "rotate(45)")
                        .style("text-anchor", "start")
                        .style("alignment-baseline", "middle");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append('text')
                        .attr("y", 15)
                        .attr("transform", "rotate(-90)")
                        .attr("fill", "#000")
                        .text("Bikes per Station");

                    function resize() {
                        try {
                            var width = parseInt(d3.select("#line").style("width")) - margin.left - margin.right,
                                height = parseInt(d3.select("#line").style("height")) - margin.top - margin.bottom;


                            // Update the range of the scale with new width/height
                            xScale.range([0, width]);
                            yScale.range([height, 0]);

                            // Update the axis and text with the new scale
                            svg.select('.x.axis')
                                .attr("transform", "translate(0," + height + ")")
                                .call(xAxis);


                            svg.select('.y.axis')
                                .call(yAxis);

                            // Force D3 to recalculate and update the line
                            svg.selectAll('.line')
                                .attr("d", function (d) {
                                    return line(d.values);
                                });

                            svg.selectAll('.circle')
                                .attr("cx", function (d) {
                                    return xScale(d.date)
                                })
                                .attr("cy", function (d) {
                                    return yScale(d.amount)
                                });

                            d3.selectAll(".circle-text")
                                .attr("x", function (d) {
                                    return xScale(d.date);
                                })
                                .attr("y", function (d) {
                                    return yScale(d.amount) - 10;
                                });

                            svg.selectAll('.legend')
                                .attr("transform", "translate(" + (width + 60) + ",0)");

                            // Update the tick marks
                            // yAxis.ticks(Math.max(height/50, 2));
                        }catch (e) {
                            console.log("SB le")
                        }
                    }

                    // Call the resize function whenever a resize event occurs
                    // d3.select(window).on('resize', resize);
                    window.addEventListener('resize', resize);
                    // Call the resize function
                    resize();
                });
            }

        },
        mounted: function () {
            this.initChart();
        }
    }
</script>

<style scoped>
    #line {
        width: 100%;
        height: 100%;
        position: absolute;
    }
</style>