<template>
    <div>
        <h3>Mapbox + D3 svg</h3>
        <div class="row">
            <div class="col">
                <div id="wrapper">
                    <div id='map' style='width: 900px; height: 600px;'></div>
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
        methods: {
            drawMap() {
                mapboxgl.accessToken = 'pk.eyJ1IjoiaW5mNTU0ZXVyZWthIiwiYSI6ImNqb2JzYzI3ODBld3EzcG80YzNqbTRtMzIifQ.vZla3jmyqwz_Ux7GcmhsCg';
                var map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v10',
                    center: [-118.30, 34.00], // starting position
                    zoom: 10 // starting zoom
                });
                // map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
                var that = this;
                map.on('load', function () {
                    d3.csv("./station_with_lat.csv").then(function (data) {
                        var container = map.getCanvasContainer();
                        var svg = d3.select(container).append("svg").attr("id", "station");
                        svg.attr("width", 900).attr("height", 600);
                        var project = function (d) {
                            // console.log("d is" + d);
                            return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
                        };
                        var circles = svg.selectAll("circle").data(data).enter()
                            .append("circle").attr("class", "dot part").attr("r", 5)
                            .attr("cx", function (d) {
                                console.log("ddddd:" + d)
                                return project([d.lon, d.lat]).x
                            })
                            .attr("cy", function (d) {
                                return project([d.lon, d.lat]).y
                            })
                            .attr("fill", "red").attr("stroke", "black")
                            .on("click", function (object) {
                                console.log(object.Station_ID);
                                that.$root.$emit('change-station', object.Station_ID);
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
