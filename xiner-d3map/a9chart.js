var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

// 1--------------
d3.json("world-110m.geojson").then(function (json) {
        svg = d3.select("#symbol")
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var projection = d3.geoEqualEarth()
        .fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule()  // graticule generator
        .step([20, 20]);

    svg.append("path")
        .datum(graticule)  //data join with a single path
        .attr("class", "graticule")
        .attr("d", path);

    var sphere = ({type: "Sphere"})
    svg.append("path")
        .datum(sphere)  //data join with a single path
        .attr("class", "sphere")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "dimgrey");

    var worldMap = svg.selectAll(".country")
        .data(json.features)  //data join with features
        .enter()
        
    worldMap.append("path")
        .attr("fill", "white")
        .attr("stroke", "dimgrey")
        .attr("d", path);  //generate geographic path

    var countryWaste = {};

    d3.json("a9data.json").then(function (data) {
        data.forEach(function(d) { countryWaste[d.country] = +d.population; });

        worldMap.append("circle")
        .attr("transform", function (d) { return "translate(" + path.centroid(d.geometry) + ")";}) 
        .attr("r", function (d) { return countryWaste[d.properties.name] / 2 || 0;})
        .attr("fill", "red")
        .attr("opacity", 0.7)
        .on("mouseover", function(d) {		
            div.transition()		
            .duration(200)		
            .style("opacity", .9);		
            div.html(d.properties.name + "<br/>"  + countryWaste[d.properties.name])	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY) + "px");	
        })					
        .on("mouseout", function(d) {		
            div.transition()		
            .duration(500)		
            .style("opacity", 0);
        });

        worldMap.append("text")
        .attr("transform", function (d) { return "translate(" + path.centroid(d.geometry) + ")";})
        .attr("x", function (d) { return countryWaste[d.properties.name] / 2 + 2 || 0;})
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .text(function(d) { return countryWaste[d.properties.name] ? d.properties.name : "" ; });

    }) 
    
    // legend
    var legend = svg.append('g')
            .attr("transform","translate(60,350)"); 
    
    var rectWidth = 120,
        rectHeight = 120;
        
        legend.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("stroke","dimgrey")
            .attr("fill","white");

    var legendLabel = legend.selectAll(".legend")
            .data([10, 20, 40, 80])
            .enter()

        legendLabel.append("circle")
            .attr("transform",function(d,i){return "translate(" + rectWidth / 2 + "," + (rectHeight - 10 - d / 2) + ")";})
            .attr("r", function(d) { return d / 2 })
            .attr("stroke","red")
            .attr("fill", "none");

        legendLabel.append("text")
            .attr("transform",function(d,i){return "translate(" + rectWidth / 2 + "," + (rectHeight - 10 - d) + ")";})
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", "red")
            .text(function(d) { return d });

});

//  2----------------
d3.json("world-110m.geojson").then(function (json) {
    var colorScale = d3.scaleSequential(d3.interpolateCool)
                        .domain([0, 70]);
                        // .domain(d3.extent(data, function(d) {return d.population; }));

    var svg = d3.select("#choropleth"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    var projection = d3.geoEqualEarth().fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule()  // graticule generator
        .step([20, 20]);

    svg.append("path")
        .datum(graticule)  //data join with a single path
        .attr("class", "graticule")
        .attr("d", path);

    var sphere = ({type: "Sphere"})
    svg.append("path")
        .datum(sphere)  //data join with a single path
        .attr("class", "sphere")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "dimgrey");

    var worldMap = svg.selectAll(".country")
        .data(json.features)  //data join with features
        .enter()
        

    var countryWaste = {};

    d3.json("a9data.json").then(function (data) {
        data.forEach(function(d) { countryWaste[d.country] = +d.population; });

        worldMap.append("path")
        .attr("fill", function(d) { return countryWaste[d.properties.name] ? colorScale(countryWaste[d.properties.name]) : "lightgrey"})
        .attr("stroke", "white")
        .attr("d", path)  //generate geographic path
        .on("mouseover", function(d) {	
            if (countryWaste[d.properties.name]) {
                div.transition()		
                .duration(200)		
                .style("opacity", .9);		
                div.html(d.properties.name + "<br/>"  + countryWaste[d.properties.name])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY) + "px");	
                
                d3.select(this)
                .style('fill', "red");
            }
        })					
        .on("mouseout", function(d) {
            if (countryWaste[d.properties.name]) {
                div.transition()		
                .duration(500)		
                .style("opacity", 0);

                d3.select(this)
                .style('fill', colorScale(countryWaste[d.properties.name]));
            }	
        });

        worldMap.append("text")
        .attr("transform", function (d) { return "translate(" + path.centroid(d.geometry) + ")";})
        .attr("alignment-baseline", "hanging")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(function(d) { return countryWaste[d.properties.name] ? d.properties.name : "" ; });
    });
    
    // legend
    var legend = svg.append('g')
            .attr("transform","translate(70,280)"); 
    
    var rectWidth = 60,
        rectHeight = 200;
        
        legend.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("x","0")
            .attr("y","0")
            .attr("stroke","dimgrey")
            .attr("fill","white");

    var legendLabel = legend.append('g')
            .attr("transform","translate(0,20)")
            .selectAll(".legend")
            .data([0, 10, 20, 30, 40, 50, 60, 70])
            .enter()

        legendLabel.append("rect")
            .attr("transform",function(d,i){return "translate( 15," + i * 20 + ")";})
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", function(d) { return colorScale(d) });

        legendLabel.append("text")
            .attr("transform",function(d,i){return "translate( 45," + (i * 20 + 10) + ")";})
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12)
            // .attr("fill", "dimgrey")
            .text(function(d) { return d });
});



// 3--------------------
d3.json("la-county-regions-current.geojson").then(function (json) {
    var svg = d3.select("#la"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    var projection = d3.geoMercator().fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule()  // graticule generator
        .step([0.2, 0.2]);

    svg.append("path")
        .datum(graticule)  //data join with a single path
        .attr("class", "graticule")
        .attr("d", path);

    svg.selectAll(".laRegion")
        .data(json.features)  //data join with features
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr("stroke", "dimgrey")
        .attr("d", path);  //generate geographic path

    d3.json("parks_and_gardens.geojson").then(function (data) {
        svg.selectAll(".park")
        .data(data.features)  
        .enter()
        .append("circle")
        .attr("transform", function (d) { 
            var marker = projection([d.properties.longitude, d.properties.latitude]); 
            return "translate(" + marker[0]+ "," + marker[1] + ")" ;
        }) 
        .attr("r", 2)
        .attr("fill", "red")
        .attr("opacity", 0.8)
        .on("mouseover", function(d) {		
            div.transition()		
            .duration(200)		
            .style("opacity", .9);		
            div.html(d.properties.name)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY) + "px");	
        })					
        .on("mouseout", function(d) {		
            div.transition()		
            .duration(500)		
            .style("opacity", 0);
        });
    });
    
    // legend
    var legend = svg.append('g')
            .attr("transform","translate(70,680)"); 
    
    var rectWidth = 150,
        rectHeight = 100;
        
        legend.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("x","0")
            .attr("y","0")
            .attr("stroke","dimgrey")
            .attr("fill","white");

    var legendLabel = legend.append('g')
            .attr("transform","translate(0,20)")

        legendLabel.append("circle")
            .attr("transform","translate(20,10)")
            .attr("r", 2)
            .attr("fill", "red")
            .attr("opacity", 0.8);
        legendLabel.append("text")
            .attr("transform","translate(40,10)")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12)
            .text("park/garden");
        
        legendLabel.append("line")
            .attr("transform","translate(10,35)")
            .attr("x1","0")
            .attr("x2","20")
            .attr("y1","0")
            .attr("y2","0")
            .attr("stroke","dimgrey");
        legendLabel.append("text")
            .attr("transform","translate(40,35)")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12)
            .text("region boundry");

        legendLabel.append("rect")
            .attr("transform","translate(10, 50)")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "white")
            .attr("stroke", "dimgrey");
        legendLabel.append("text")
            .attr("transform","translate(40,60)")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12)
            .text("L.A. county region");
});