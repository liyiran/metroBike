<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <select v-on:change="onChange" id="select">
                    <option value="-1">Select Month</option>
                    <option value="0">Jul 2016</option>
                    <option value="1">Aug 2016</option>
                    <option value="2">Sep 2016</option>
                    <option value="3">Oct 2016</option>
                    <option value="4">Nov 2016</option>
                    <option value="5">Dec 2016</option>
                    <option value="6">Jan 2017</option>
                    <option value="7">Feb 2017</option>
                    <option value="8">Mar 2017</option>
                    <option value="9">Apr 2017</option>
                    <option value="10">May 2017</option>
                    <option value="11">Jun 2017</option>
                    <option value="12">Jul 2017</option>
                    <option value="13">Aug 2017</option>
                    <option value="14">Sep 2017</option>
                    <option value="15">Oct 2017</option>
                    <option value="16">Nov 2017</option>
                    <option value="17">Dec 2017</option>
                    <option value="18">Jan 2018</option>
                    <option value="19">Feb 2018</option>
                    <option value="20">Mar 2018</option>
                    <option value="21">Apr 2018</option>
                    <option value="22">May 2018</option>
                    <option value="23">Jun 2018</option>
                </select>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-sm-8" id="container">
                <div style="min-height: 800px !important;">
                    <svg id="pie"></svg>
                </div>
            </div>
            <div class="col-sm-4 align-top">
                <div class="card" >
                    <div class="card-body">
                        <h4 id="pie-card-name" class="card-title">Monthly Bike Usage</h4>
                        <h6 class="card-subtitle mb-2 text-muted">The Average Amount of Metro Bikes Used in Regions in Each Month</h6>
                        <p id="pie-card-desc" class="card-text">Select month from dropdown box. Mouse over pie slices for detailed Information.
                            <br/>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: "countByRegion",

        methods: {
            onChange() {
                d3.select("#pie").selectAll("*").remove();
                this.initChart();
            },
            initChart() {
                d3.json("./countMonthRegionPie.json").then(function (dataset) {
                    // console.log(dataset);

                    var region = dataset.map(function (d) {
                        return d.region
                    });
                    var color = d3.scaleOrdinal()
                        .domain(region)
                        .range(d3.schemeCategory10);
                    var sel = document.getElementById('select');
                    var value = sel.options[sel.selectedIndex].value

                    if (value == -1) {
                        var data = [{region: "DTLA", average: "1"}, {region: "Pasadena", average: "1"}, {region: "PortOfLA", average: "1"}, {region: "Venice", average: "1"}]
                    }
                    else { var data = dataset[value].count; }

                    // var data = dataset[22].count;
                    // console.log(data);

                    var diameter = parseInt(d3.select('#container').property('clientWidth'));
                    if (diameter > 800) {
                        diameter = 800
                    }

                    var radiusOver = diameter / 2,
                        radius = radiusOver - 30;

                    var svg = d3.select("#pie")
                    // .attr("width", diameter)
                    // .attr("height", diameter)
                        .attr("class", "pie");

                    // console.log("hahahhahah")
                    var g = svg.append("g")
                        .attr('id','wholeG')
                        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                    var pie = d3.pie()  //pie generator
                        .value(function (d) {
                            return d.average;
                        });

                    var path = d3.arc()
                        .outerRadius(radius)
                        .innerRadius(0);  //make != 0 for a donut chart

                    var pathOver = d3.arc()
                        .outerRadius(radiusOver)
                        .innerRadius(0);  //make != 0 for a donut chart

                    var label = d3.arc()
                        .outerRadius(radius * 1/3)
                        .innerRadius(radius);

                    var labelOver = d3.arc()
                        .outerRadius(radiusOver * 1/3)
                        .innerRadius(radiusOver);

                    var arc = g.selectAll(".arc")
                        .data(pie(data))  //use pie generator to create the data needed for the each slice of the pie
                        .enter().append("g")
                        .attr("class", function (d) {
                            return d.data.region;
                        })

                    var slice = arc.append("path")  //for each slide use arc path generator to draw the pie
                        .attr("d", path)
                        .attr("class", "slice")
                        // .attr("stroke", "white")
                        .attr("fill", function (d) {
                            return color(d.data.region);
                        });  //get data from node (select and $0.__data__ in console)

                    console.log("1: " + radius)

                    arc.append("text")  //for each slide use label path generator to place the text
                        .attr("class", "text")
                        .attr("transform", function(d) {
                            var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                            return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
                        // .attr("dy", ".35em")
                        .attr('text-anchor', 'middle')
                        .attr('fill', 'black')
                        // .attr("dy", "0.35em")
                        .style("font-size", radius / 10)
                        .text(function (d) {
                            return d.data.region;
                        });
                    var sel = document.getElementById('select');
                    var text = sel.options[sel.selectedIndex].text
                    if(value != -1) {
                        slice.on("mouseover", function (d) {
                            d3.select('#pie-card-name').html(d.data.region);
                            d3.select('.card-subtitle').html(text);
                            d3.select('#pie-card-desc').html(d.data.average + ' bikes per station<br/>');
                            d3.selectAll('.slice')
                                .style('opacity', 0.5);
                            d3.select(this).transition()
                                .duration(300)
                                .attr("d", pathOver)
                                .style('opacity', 1);

                            d3.selectAll("." + d.data.region).selectAll('.text')
                                .transition()
                                .duration(300)
                                .attr("transform", function(d) {
                                    var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                                    return "translate(" + labelOver.centroid(d)[0] + "," + labelOver.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
                                // .attr("dy", ".35em")
                                .style("font-size", radiusOver / 10)
                        })
                            .on("mouseout", function () {
                                d3.select('#pie-card-name').html('Monthly Bike Usage');
                                d3.select('.card-subtitle').html('The Average Amount of Metro Bike Used in Regions in Each Month');
                                d3.select('#pie-card-desc').html('Mouse over pie slices for detailed information.<br/>');
                                d3.selectAll('.slice')
                                    .style('opacity', 1);
                                d3.select(this).transition()
                                    .duration(300)
                                    .attr("d", path);

                                d3.selectAll('.text')
                                    .transition()
                                    .duration(300)
                                    .attr("transform", function(d) {
                                        var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                                        return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
                                    // .attr("dy", ".35em")
                                    .style("font-size", radius / 10);
                                console.log("2: " +radius)
                            });
                    }

                    function resize() {
                        var diameter = parseInt(d3.select('#container').property('clientWidth'));
                        if (diameter > 800) {
                            diameter = 800
                        }
                        var radiusOver = diameter / 2,
                            radius = radiusOver - 30;

                        console.log("d: " + diameter)

                        // d3.select("#pie")
                        // .attr("width", diameter)
                        // .attr("height", diameter)

                        d3.select('#wholeG').attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                        var path = d3.arc()
                            .outerRadius(radius)
                            .innerRadius(0);  //make != 0 for a donut chart

                        var pathOver = d3.arc()
                            .outerRadius(radiusOver)
                            .innerRadius(0);  //make != 0 for a donut chart

                        var label = d3.arc()
                            .outerRadius(radius * 1/3)
                            .innerRadius(radius);

                        var labelOver = d3.arc()
                            .outerRadius(radiusOver * 1/3)
                            .innerRadius(radiusOver);

                        svg.selectAll('.slice') //for each slide use arc path generator to draw the pie
                            .attr("d", path)

                        arc.selectAll(".text")  //for each slide use label path generator to place the text
                            .attr("transform", function(d) {
                                var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                                return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";
                            })
                            .style("font-size", radius / 10);
                    }

                    d3.select(window).on('resize', resize);
                    // window.addEventListener('resize', resize);
                    resize();
                })
            }

        },
        mounted: function () {
            this.initChart();
            var that = this;

        }
    }
</script>

<style scoped>
    #pie {
        width: 100%;
        height: 100%;
        position: absolute;
    }
</style>