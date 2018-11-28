<template>
    <div>
        <h3>Dot map using D3</h3>
        <div class="row">
            <div class="col">
                <svg class="mx-auto d-block" id="ca" width="900" height="600"></svg>
            </div>
        </div>
    </div>
</template>
<script>
    import * as d3 from 'd3';

    export default {
        name: "StationD3DotMap",
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
                    d3.csv("./station_with_lat.csv").then(function (data) {
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
                        svg.selectAll(".station")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("transform", function (d) {
                                var marker = projection([d.lon, d.lat]);
                                return "translate(" + marker[0] + "," + marker[1] + ")";
                            })
                            .attr("r", 2)
                            .attr("fill", "red")
                            .attr("opacity", 0.8)
                            .on("mouseover", function (d) {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(
                                    'Station ID: ' + d.Station_ID + 
                                    '<br/> Station Name: ' + d.Station_Name +
                                    '<br/> Region: ' + d.Region +
                                    '<br/> Status: ' + d.Status
                                    )
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY) + "px");
                            })
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    });
                    d3.json("./bus-line.geojson").then(function (data) {
                        svg.selectAll(".line")
                            .data(data.features)
                            .enter()
                            .append("path")
                            .attr("d", path)  //generate geographic path
                            .attr("fill", 'none')
                            .attr("stroke", "blue")
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

    div.tooltip {	
        position: absolute;			
        text-align: left;			
        width: auto;					
        height: auto;					
        padding: 5px;				
        font-size: 18px;		
        background: lightsteelblue;	
        border: 0px;		
        border-radius: 8px;			
        pointer-events: none;			
    }
</style>