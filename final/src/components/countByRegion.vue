<template>
    <div class="container">
        <div class="row align-items-center">
            <div class="col-sm-8">
                <div style="min-height: 600px !important;">
                <svg id="pie"> </svg> 
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card" style="width: 20rem;">
                    <div class="card-body">
                        <h4 id="pie-card-name" class="card-title">Monthly Bike Usage</h4>
                        <h6 class="card-subtitle mb-2 text-muted">The Average Amount of Metro Bike Used in Regions in Each Month</h6>
                        <p id="pie-card-desc" class="card-text">Mouse over pie slices for detailed Information.
                            <br/>
                        </p >
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
            initChart() {
                console.log("hello")
                d3.json("./countMonthRegion.json").then(function(dataset) {
                    console.log(dataset)
            
                var region = dataset.map(function(d) { return d.region });
                var color = d3.scaleOrdinal()
                    .domain(region)
                    .range(d3.schemeCategory10);

                var data = dataset[22].count
                console.log(data)

                // // var formatComma = d3.format(",");

                var diameter = parseInt(d3.select('.col-sm-8').property('clientWidth')),
                    radiusOver = diameter / 2,
                    radius = radiusOver - 30;
    
                var svg = d3.select("#pie")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("class", "pie");
                
                var g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                var pie = d3.pie()  //pie generator
                    .value(function(d) { return d.average; });
                
                var path = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(0);  //make != 0 for a donut chart

                var pathOver = d3.arc()
                    .outerRadius(radiusOver)
                    .innerRadius(0);  //make != 0 for a donut chart

                var label = d3.arc()
                    .outerRadius(radius )
                    .innerRadius(radius );
                
                var labelOver = d3.arc()
                    .outerRadius(radiusOver )
                    .innerRadius(radiusOver );
            
                var arc = g.selectAll(".arc")
                    .data(pie(data))  //use pie generator to create the data needed for the each slice of the pie
                    .enter().append("g")
                    .attr("class", function(d) { return d.data.region; })
                
                var slice = arc.append("path")  //for each slide use arc path generator to draw the pie
                    .attr("d", path)
                    .attr("class", "slice")
                    .attr("fill",function(d) { return color(d.data.region); });  //get data from node (select and $0.__data__ in console)
                
                arc.append("text")  //for each slide use label path generator to place the text
                    .attr("class","text")
                    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .attr("dy", "0.35em")
                    .attr("font-size", radius/10)
                    .text(function(d) { return d.data.region; });

                slice.on("mouseover", function(d){
                    d3.select('#pie-card-name').html(d.data.region);
                    d3.select('#pie-card-desc').html(d.data.average + ' bikes<br/>');
                    d3.selectAll('.slice')
                        .style('opacity', 0.5);
                    d3.select(this).transition()
                        .duration(300)
                        .attr("d", pathOver)
                        .style('opacity', 1);

                    d3.selectAll("."+d.data.region).selectAll('.text')
                        .transition()
                        .duration(300)
                        .attr("transform", function(d) { return "translate(" + labelOver.centroid(d) + ")"; })
                        .style("font-size", radiusOver/10)
                })
                .on("mouseout", function(){
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
                        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                        .style("font-size", radius/10)
                });
            })
        }
        
    },
    mounted: function () {
            this.initChart();
        }
    }
</script>

<style scoped>

</style>