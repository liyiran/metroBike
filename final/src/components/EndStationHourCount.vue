<template>
    <div>
        <h3>Count By Hour For Each Return Station</h3>
        <div class="container" id="chart2"></div>
    </div>
</template>
<!--https://medium.com/tyrone-tudehope/composing-d3-visualizations-with-vue-js-c65084ccb686-->

<script>
    import * as d3 from 'd3';

    export default {
        name: 'EndStationHourCount',
        data(){
            var hourFields = ["0","1","2","3","4","5","6","7"
                                ,"8","9","10","11","12","13","14","15"
                                ,"16","17","18","19","20","21","22","23"];
            // Define dimensions
            var margin = {
                top: 20,
                right: 20,
                bottom:30,
                left: 40
            };
            var width= 1000 - margin.left - margin.right;
            var height= 600- margin.top - margin.bottom;
            return {
                hourFields: hourFields,
                margin: margin,
                width: width,
                height: height 
            };
        },
        methods: {
            draw_bar_chart(d) {
                let that = this;
                
                // Make x scale
                var xScale  = d3.scaleBand()
                    .domain(that.hourFields)
                    .rangeRound([0, this.width]).padding(0.1);
                
                // Make y scale, the domain will be defined on bar update
                var yScale = d3.scaleLinear().rangeRound([this.height, 0]);

                 // Create canvas
                var canvas = d3.select("#chart2")
                    .append("svg")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");

                // Make x-axis and add to canvas
                var xAxis = d3.axisBottom(xScale);

                canvas.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(xAxis);

                // Make y-axis and add to canvas
                var yAxis = d3.axisLeft(yScale).ticks(10);
        
                var yAxisHandleForUpdate = canvas.append("g")
                    .attr("class", "axis axis--y")
                    .call(yAxis);
                
                yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Amount");

                var updateBars = function(d){
                    //First update the y-axis domain to match data
                    yScale.domain(d3.extent(d));
                    yAxisHandleForUpdate.call(yAxis);

                    var bars = canvas.selectAll(".bar").data(d);

                    // Add bars for new data
                    bars.enter()
                        .append("rect")
                        .attr("class", "bar")
                        .merge(bars)
                        .attr("x", function(d,i){return xScale(that.hourFields[i]);})
                        .attr("y", function(d){return yScale(d);})
                        .attr("width", xScale.bandwidth())
                        .attr("height", function(d){return that.height - yScale(d);})
                        .on("mouseover", function() { 
                            d3.select(this).attr("fill", "red");
                            tooltip.style("display", null); })
                        .on("mouseout", function() { 
                            d3.select(this)
                                .transition("colorfade")
                                .duration(250)
                                .attr("fill","lightBlue");
                            tooltip.style("display", "none"); })
                        .on("mousemove", function(d) {
                            var xPosition = d3.mouse(this)[0] - 15;
                            var yPosition = d3.mouse(this)[1] - 25;
                            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                            tooltip.select("text").text(d);
                        })
                        .attr("fill", "lightBlue");

                    // Update old ones, already have x / width from before
                    bars.transition()
                        .delay(1500)
                        .attr("y", function(d){return yScale(d);})
                        .attr("height", function(d){return that.height - yScale(d);});

                    // Remove old ones
                    bars.exit().remove();

                    // Prep the tooltip bits, initial display is hidden
                    var tooltip = canvas.append("g")
                        .attr("class", "info")
                        .style("display", "none");
                        
                    tooltip.append("rect")
                        .attr("width", 30)
                        .attr("height", 20)
                        .attr("fill", "white")
                        .style("opacity", 0.5);

                    tooltip.append("text")
                        .attr("x", 15)
                        .attr("dy", "1.2em")
                        .style("text-anchor", "middle")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold");

                };

                // Handler for dropdown value change
                var dropdownChange = function(){
                    var newStation = d3.select(this).property('value'),
                        newData = d[newStation];
                    updateBars(newData);
                };

                // Get names of cereals, for dropdown
                var stations = Object.keys(d).sort();
                var dropdown = d3.select("#chart2")
                    .insert("select", "svg")
                    .on("change", dropdownChange);

                dropdown.selectAll("option")
                    .data(stations)
                    .enter()
                    .append("option")
                    .attr("value", function(d){return d;})
                    .text(function(d){
                        return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
                    });

                var initialData = d[stations[0]];
                updateBars(initialData);

            },
            createChart() {
                var fileName = "./pivot_hour_count_end.csv";
                
                let that = this;
                d3.csv(fileName).then(function(data){
                    
                    var stationData = {};
                    data.forEach(function(d){
                        var station = d.station_id;
                        stationData[station] = [];
                        that.hourFields.forEach(function(field){
                            stationData[station].push( +d[field]);
                        });
                    });
                    console.log(stationData);

                    that.draw_bar_chart(stationData);
                 });
            },
            
           
        },

        mounted: function () {
            this.createChart();  
        }
    }
</script>