<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <svg class="mx-auto d-block" id="ca" width="1000" height="1000"></svg>
            </div>
        </div>
    </div>
</template>

<script>

    import * as d3 from 'd3';

    export default {
        name: "StationD3DotMap",
        // data() {
        //    
        //     return {svg: svg, width: width, height: height};
        // },
        methods: {
            draw() {
                var that = this;
                var svg = d3.select("#ca"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");
                d3.json("./la-county-regions-current.geojson").then(function (caJson) {

                    var projection = d3.geoMercator().fitSize([width, height], caJson);
                    var path = d3.geoPath().projection(projection);
                    var graticule = d3.geoGraticule()  // graticule generator
                        .step([0.2, 0.2]);
                    svg.append("path")
                        .datum(graticule)  //data join with a single path
                        .attr("class", "graticule")
                        .attr("d", path);
                    svg.selectAll(".caRegion")
                        .data(caJson.features)  //data join with features
                        .enter()
                        .append("path")
                        .attr("fill", "white")
                        .attr("stroke", "dimgrey")
                        .attr("d", path);  //generate geographic path
                    d3.json("./stations.json").then(function (data) {
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
                        svg.selectAll(".station")
                            .data(data.features)
                            .enter()
                            .append("circle")
                            .attr("transform", function (d) {
                                var marker = projection([d.properties.longitude, d.properties.latitude]);
                                return "translate(" + marker[0] + "," + marker[1] + ")";
                            })
                            .attr("r", 2)
                            .attr("fill", "red")
                            .attr("opacity", 0.8)
                            .on("mouseover", function (d) {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(d.properties.name)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY) + "px");
                            })
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    });
                    d3.json("./bus-stops.geojson").then(function (data) {
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
                        svg.selectAll(".station")
                            .data(data.features)
                            .enter()
                            .append("circle")
                            .attr("transform", function (d) {
                                var marker = projection([d.properties.LONG, d.properties.LAT]);
                                return "translate(" + marker[0] + "," + marker[1] + ")";
                            })
                            .attr("r", 2)
                            .attr("fill", "green")
                            .attr("opacity", 0.8)
                            .on("mouseover", function (d) {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(d.properties.name)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY) + "px");
                            })
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    });

                });
            }
        },
        mounted: function () {
            this.draw();
        }
    }
</script>

<style>
    #ca {
        background-color: aliceblue;
    }

    .graticule {
        fill: none;
        stroke: lightskyblue;
        stroke-width: 1px;
        stroke-opacity: 0.5;
    }
</style>