<template>
    <div>
        <!-- <h3>Biking Station and shopping and bus lines distribution based on D3 dot map</h3> -->
        <!-- <p class="alert alert-primary">This map portraits the bike station distribution. 
            Each red dot is a bike station where you can borrow or return a bike.
            The color on the map indicates number of shopping malls in this area. The darker the color the more shopping mall. 
            The blue lines are bus lines.
        </p> -->
        <!-- <p class="alert alert-info">Move your mouse on the dot to see more details.</p> -->
        <div class="alert alert-info">
            Moving mouse over red dots to see more details.
        </div>
        <div class="row">
            <div class="col">
                <svg class="mx-auto d-block" id="ca" width="100%" height="500"></svg>
            </div>
        </div>
        <div class="container">
            <br/>
            <p>From this graph we can find that most bike stations are near the bus lines and business center. 
                However, we may put more stations on the eastern aear since it has bus lines and shopping center but no station at all.
            </p>
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
                d3.csv("./business_count.csv").then(function (business) {
                    var map = {};
                    business.forEach(function (b, index) {
                        map[b.city] = b.count;
                    });
                    
                    var colorScale = d3.scaleSequential(d3.interpolateGreens)
                        .domain([0, 1537])
                        ;
                    d3.json("./la-county-regions-current.geojson").then(function (caJson) {

                        var projection = d3.geoMercator().center([-118.353683, 33.952235]).scale(40000);
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
                            .attr("d", path)
                            .attr('name',function(d) {
                                return d.properties.name
                            });  //generate geographic path
                        d3.json("./bus-line.geojson").then(function (data) {
                            svg.selectAll(".line")
                                .data(data.features)
                                .enter()
                                .append("path")
                                .attr("d", path)  //generate geographic path
                                .attr("fill", 'none')
                                .attr("stroke", "blue")
                        });
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
                        

                    });
                });

            },
            drawLegend(){
                var svg = d3.select("#ca"); 

                var legend = svg.append('g')
                    .attr("transform","translate(70,300)"); 
                
                var rectWidth = 150,
                    rectHeight = 80;
                    
                legend.append("rect")
                        .attr("width", rectWidth)
                        .attr("height", rectHeight)
                        .attr("x","0")
                        .attr("y","0")
                        .attr("stroke","dimgrey")
                        .attr("fill","white")
                        .attr("opacity", 1);

                var legendLabel = legend.append('g')
                        .attr("transform","translate(0,20)")

                    legendLabel.append("circle")
                        .attr("transform","translate(20,10)")
                        .attr("r", 2)
                        .attr("fill", "red")
                    legendLabel.append("text")
                        .attr("transform","translate(40,10)")
                        .attr("alignment-baseline", "middle")
                        .attr("font-size", 12)
                        .text("Metro Bike Station");
                    
                    legendLabel.append("line")
                        .attr("transform","translate(10,35)")
                        .attr("x1","0")
                        .attr("x2","20")
                        .attr("y1","0")
                        .attr("y2","0")
                        .attr("stroke","blue");
                    legendLabel.append("text")
                        .attr("transform","translate(40,35)")
                        .attr("alignment-baseline", "middle")
                        .attr("font-size", 12)
                        .text("Bus Line");
            }
        },
        mounted: function () {
            this.draw();
            this.drawLegend();
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