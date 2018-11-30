<template>
    <div>
        <h3>Mapbox + D3 svg</h3>
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col-2">
                        <button type="button" class="btn btn-primary" v-on:click="DTLA()">DTLA</button>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-primary" v-on:click="pasadena()">Pasadena</button>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-primary" v-on:click="portOfLA()">PortOfLA</button>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-primary" v-on:click="venice()">Venice</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div id="wrapper">
                            <div id='map' style='width: 100%; height: 600px;'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    #map {
        top: 0;
        bottom: 0;
        width: 100%;
    }

    #station {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
<script>
    import * as mapboxgl from 'mapbox-gl';
    import * as d3 from 'd3';

    export default {
        name: 'StationDotMap',
        data: function () {
            return {map: null}
        },
        methods: {
            DTLA: function () {
                this.map.flyTo({
                    center: [
                        -118.243683,
                        34.052235
                    ]
                });
            },
            pasadena: function () {
                this.map.flyTo({
                    center: [
                        -118.1445155,
                        34.1477849
                    ]
                });
            },
            portOfLA: function () {
                this.map.flyTo({
                    center: [
                        -118.292244,
                        33.736061
                    ]
                });
            },
            venice: function () {
                this.map.flyTo({
                    center: [
                        -118.469037,
                        33.977816
                    ]
                });
            },
            drawMap() {
                mapboxgl.accessToken = 'pk.eyJ1IjoiaW5mNTU0ZXVyZWthIiwiYSI6ImNqb2JzYzI3ODBld3EzcG80YzNqbTRtMzIifQ.vZla3jmyqwz_Ux7GcmhsCg';
                var map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v10',
                    center: [-118.30, 34.00], // starting position
                    zoom: 10 // starting zoom
                });
                this.map = map;
                map.scrollZoom.disable();
                map.addControl(new mapboxgl.NavigationControl());
                // map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
                var that = this;
                map.on('load', function () {
                    d3.csv("./station_with_lat.csv").then(function (data) {
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip_mapbox")
                            .style("opacity", 0);

                        var container = map.getCanvasContainer();
                        var svg = d3.select(container).append("svg").attr("id", "station");
                        svg.attr("width", 900).attr("height", 600);
                        var project = function (d) {
                            // console.log("d is" + d);
                            return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
                        };
                        var circles = svg.selectAll("circle").data(data).enter()
                            .append("circle").attr("class", "dot").attr("r", 5)
                            .attr("cx", function (d) {
                                return project([d.lon, d.lat]).x
                            })
                            .attr("cy", function (d) {
                                return project([d.lon, d.lat]).y
                            })
                            .attr("fill", "red").attr("stroke", "black")
                            .on("click", function (object) {
                                that.$root.$emit('change-station', object.Station_ID);
                                div.transition()
                                    .duration(200)
                                    .style("opacity", 1);
                                div.html(
                                    '<b>Station ID:</b> ' + object.Station_ID +
                                    '<br/> <b>Station Name:</b> ' + object.Station_Name +
                                    '<br/> <b>Region:</b> ' + object.Region +
                                    '<br/> <b>Status:</b> ' + object.Status
                                )
                                // .style("left", (project([object.lon, object.lat]).x) )
                                // .style("top", (project([object.lon, object.lat]).y));
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY) + "px");
                                console.log('project: ' + project([object.lon, object.lat]).x)
                                console.log('event: ' + d3.event.pageX)

                                d3.selectAll('.dot').style('fill', 'red');
                                d3.select(this).style('fill', 'blue');
                            })
                            .on("mouseover", function () {
                                d3.select(this).style("cursor", "pointer");
                            })
                            .on("mouseout", function () {
                                d3.select(this).style("cursor", "default");
                            });
                        // Update on map interaction
                        map.on("viewreset", update);
                        map.on("move", update);
                        map.on("moveend", update);

                        function update() {
                            circles.attr("cx", function (d) {
                                return project([d.lon, d.lat]).x
                            })
                                .attr("cy", function (d) {
                                    return project([d.lon, d.lat]).y
                                });
                        }
                    });
                });

            },
            onResize(event) {
                var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
                var mapDiv = document.getElementById('map');
                mapDiv.style.width = '100%';
                mapCanvas.style.width = '100%';
            }
        },
        mounted: function () {
            this.drawMap();
            window.addEventListener('resize', this.onResize)
        }
    }
</script>

<style>
    div.tooltip_mapbox {
        position: absolute;
        text-align: left;
        width: auto;
        height: auto;
        padding: 5px;
        font-size: 15px;
        background: white;
        border: 2px solid black;
        border-radius: 8px;
        pointer-events: none;
    }
</style>
