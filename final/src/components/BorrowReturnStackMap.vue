<template>
    <div class="row">
        <div class="col">
            <div class="container">
                <svg width="400" height="400" font-family="sans-serif" font-size="10" text-anchor="middle" id="stack_chart">
                </svg>
            </div>
        </div>
    </div>
</template>
<style scoped>

    body {
        font: 10px sans-serif;
    }

    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }

    .bar {
        fill: steelblue;
    }

    .x.axis path {
        display: none;
    }

</style>
<script>
    import * as d3 from 'd3';

    export default {
        name: 'BorrowReturnStackChart',
        // data() {
        //
        // },
        methods: {
            draw() {
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scaleBand()
                    .range([0, width]);

                var y = d3.scaleLinear()
                    .range([height, 0]);

                var color = d3.scaleOrdinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
                var colors = {
                    "Heat Rejection": "#9F5164",
                    "Heating": "#cb2e2e",
                    "Heat Recovery": "#ED7D30",
                    "Interior Lighting": "#FFDC6F",
                    "Exterior Lighting": "#F4E1AF",
                    "Generators": "#EDEDEE",
                    "Refrigeration": "#dfdfe1",
                    "Humidification": "#CDE7CA",
                    "Interior Equipment": "#B9EACD",
                    "Exterior Equipment": "#B5D0DD",
                    "Water Systems": "#66A5D8",
                    "Cooling": "#3076B6",
                    "Fans": "#604987",
                    "Pumps": "#9d5282"
                };

                var matchKeys = [
                    "Case",
                    "Heat Rejection",
                    "Heating",
                    "Heat Recovery",
                    "Interior Lighting",
                    "Exterior Lighting",
                    "Generators",
                    "Refrigeration",
                    "Humidification",
                    "Interior Equipment",
                    "Exterior Equipment",
                    "Water Systems",
                    "Cooling",
                    "Fans",
                    "Pumps"
                ];
                var xAxis = d3.axisBottom(x);

                var yAxis = d3.axisLeft(y)
                    .tickFormat(d3.format(".2s"));

                var svg = d3.select("#stack_chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                d3.dsv(",", './StackData.csv').then(function (data) {
                    color.domain(d3.keys(data[0]).filter(function (key) {
                        return key !== "Case";
                    }));
                    data.forEach(function (d) {
                        var y0 = 0;
                        d.ages = color.domain().map(function (name) {
                            return {name: name, y0: y0, y1: y0 += +d[name]};
                        });
                        d.ages = d.ages.sort(function (a, b) {
                            return matchKeys.indexOf(a.name) - matchKeys.indexOf(b.name);
                        });
                        y0 = 0;
                        d.ages.forEach(function (dd) {
                            dd.y0 = y0;
                            dd.y1 = y0 += +d[dd.name]
                        });
                        d.total = d.ages[d.ages.length - 1].y1;
                    });
                    x.domain(data.map(function (d) {
                        return d.Case;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                        return d.total;
                    })]);
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
                        // .append("text")
                        // .attr("transform", "rotate(-90)")
                        // .attr("y", 6)
                        // .attr("dy", ".71em")
                        // .style("text-anchor", "end")
                        // .text("Population");
                    var state = svg.selectAll(".state")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "g")
                        .attr("transform", function (d) {
                            return "translate(" + x(d.Case) + ",0)";
                        });
                    state.selectAll("rect")
                        .data(function (d) {
                            return d.ages;
                        }).enter().append("rect")
                        .attr("width", x.bandwidth())
                        .attr("y", function (d) {
                            return y(d.y1);
                        })
                        .attr("height", function (d) {
                            return y(d.y0) - y(d.y1);
                        })
                        .style("fill", function (d) {
                            return colors[d.name];
                        });
                    var legend = svg.selectAll(".legend")
                        .data(color.domain().slice().reverse())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) {
                            return "translate(0," + i * 20 + ")";
                        });
                    legend.append("rect")
                        .attr("x", width - 18)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", function (d) {
                            return colors[d];
                        });
                    legend.append("text")
                        .attr("x", width - 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .text(function (d) {
                            return d;
                        });
                });
            },
        },
        mounted: function () {
            this.draw();
        }
    }
</script>