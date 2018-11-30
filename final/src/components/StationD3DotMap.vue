<template>
    <div>
        <h3>Biking Station and shopping and bus lines distribution based on D3 dot map</h3>
        <p class="alert alert-primary">This map portraits the bike station distribution. 
            Each red dot is a bike station where you can borrow or return a bike.
            The color on the map indicates number of shopping malls in this area. The darker the color the more shopping mall. 
            The blue lines are bus lines.
        </p>
        <p class="alert alert-info">Move your mouse on the dot to see more details.</p>
        <div class="row">
            <div class="col">
                <svg class="mx-auto d-block" id="ca" width="100%" height="500"></svg>
            </div>
        </div>
        <p class="alert alert-dark">From this graph we can find that most bike stations are near the bus lines and business center. 
            However, we may put more stations on the eastern aear since it has bus lines and shopping center but no station at all.
        </p>
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
                d3.csv("./business_count.csv").then(function (business) {
                    var map = {};
                    business.forEach(function (b, index) {
                        map[b.city] = b.count;
                    });
                    
                    var colorScale = d3.scaleSequential(d3.interpolateGreens)
                        .domain([0, 1537])
                        ;
                    d3.json("./la-county-regions-current.geojson").then(function (caJson) {

                        var projection = d3.geoMercator().center([-117.843683, 33.952235]).scale(40000);
                        window.addEventListener('resize', function () {
                            projection.center([-118.243683, 33.952235]);
                        });
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
                            .attr("fill", function (d) {
                                if(map[d.properties.name.toUpperCase()]){
                                    return colorScale(map[d.properties.name.toUpperCase()]);
                                }else{
                                    return "white";
                                }
                            })
                            .attr("stroke", "dimgrey")
                            .attr("d", path);  //generate geographic path
                        d3.csv("./station_lat.csv").then(function (data) {
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