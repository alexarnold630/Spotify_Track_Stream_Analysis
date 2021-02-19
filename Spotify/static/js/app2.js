var chosen_xaxis = "danceability";
var chosen_yaxis = "popularity";

$(document).ready(function() {
    readYearData(-1);
    doWork();
    
    //Event Listener
    $("#decade").change(function(){
        var filter = $("#decade").val();
       readYearData(filter);
    });

    $(window).resize(function() {
        readYearData(-1);
        doWork();
    });
});

function readYearData(decadeFilter){
    d3.csv("static/data/data_by_year.csv").then(function(yearData) {
        console.log(yearData);

        var filterData = yearData;
        if(decadeFilter == 2020){
            filterData = yearData.filter(x => (x.year >= 2020) & (x.year < 2030));
        } else if (decadeFilter == 2010){
            filterData = yearData.filter(x => (x.year >= 2010) & (x.year < 2020));
        } else if (decadeFilter == 2000){
            filterData = yearData.filter(x => (x.year >= 2000) & (x.year < 2010));
        } else if (decadeFilter == 1990){
            filterData = yearData.filter(x => (x.year >= 1990) & (x.year < 2000));
        } else if (decadeFilter == 1980){
            filterData = yearData.filter(x => (x.year >= 1980) & (x.year < 1990));
        } else if (decadeFilter == 1970){
            filterData = yearData.filter(x => (x.year >= 1970) & (x.year < 1980)); 
        } else if (decadeFilter == 1960){
            filterData = yearData.filter(x => (x.year >= 1960) & (x.year < 1970)); 
        } else if (decadeFilter == 1950){
            filterData = yearData.filter(x => (x.year >= 1950) & (x.year < 1960)); 
        } else if (decadeFilter == 1940){
            filterData = yearData.filter(x => (x.year >= 1940) & (x.year < 1950)); 
        } else if (decadeFilter == 1930){
            filterData = yearData.filter(x => (x.year >= 1930) & (x.year < 1940)); 
        } else if (decadeFilter == 1920){
            filterData = yearData.filter(x => (x.year >= 1920) & (x.year < 1930)); 
        } else {
            filterData = yearData;
        }

        makeLineChart(filterData);
        buildHeatmap(filterData);

    }).catch(function(error) {
        alert("YOU BROKE SOMETHING. JK. It was Aakash.");
        console.log(error);
    });

};

function makeLineChart(filterData){

        // make the plot
        $("#line").empty();

        // STEP 1: set up the chart
        var svgWidth = $('#line').width();
        var svgHeight = $(window).height();

        var margin = {
            top: 40,
            right: 150,
            bottom: 80,
            left: 50
        };

        // get the area for the viz itself
        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        // STEP 2: CREATE THE SVG (if it doesn't exist already)
        var svg = d3.select("#line")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // STEP 3: PREPARE THE DATA
        var timeParser = d3.timeParse("%Y");
        filterData.forEach(function(row) {
            row.year = timeParser(row.year); //cast the date string to a datetime object data type
            row.acousticness = +row.acousticness;
            row.danceability = +row.danceability;
            row.energy = +row.energy;
            row.instrumentalness = +row.instrumentalness;
            row.liveness = +row.liveness;
            row.speechiness = +row.speechiness;
            row.valence = +row.valence;
        });
        
        // STEP 4: CREATE SCALES
        var col1_max = d3.max(filterData, d => d.acousticness);
        var col2_max = d3.max(filterData, d => d.danceability);
        var col3_max = d3.max(filterData, d => d.energy);
        var col4_max = d3.max(filterData, d => d.instrumentalness);
        var col5_max = d3.max(filterData, d => d.liveness);
        var col6_max = d3.max(filterData, d => d.speechiness);
        var col7_max = d3.max(filterData, d => d.valence);
        var total_max = d3.max([col1_max, col2_max, col3_max, col4_max, col5_max, col6_max, col7_max]);

        var xScale = d3.scaleTime()
            .domain(d3.extent(filterData, d => d.year))
            .range([0, chart_width]);

        var yScale = d3.scaleLinear()
            .domain([0, total_max])
            .range([chart_height, 0]);

        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale); // cast the datetime back to a string for display (only for time series)

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);
        
        // STEP 6: CREATE THE GRAPH

        // for line graphs - create line generator and then draw the line
        var line_gen1 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.acousticness));

        var line_gen2 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.danceability));
        
        var line_gen3 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.energy));
        
        var line_gen4 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.instrumentalness));
        
        var line_gen5 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.liveness));
        
        var line_gen6 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.speechiness));
        
        var line_gen7 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.valence));

        //Append
        var line1 = chartGroup.append("path")
            .attr("d", line_gen1(filterData))
            .classed("line red", true)
            
        var line1_length = line1.node().getTotalLength();
        line1.attr("stroke-dasharray", `${line1_length} ${line1_length}`)
            .attr("stroke-dashoffset", line1_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
            
        var line2 = chartGroup.append("path")
            .attr("d", line_gen2(filterData))
            .classed("line yellow", true);
        
        var line2_length = line2.node().getTotalLength();
        line2.attr("stroke-dasharray", `${line2_length} ${line2_length}`)
            .attr("stroke-dashoffset", line2_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line3 = chartGroup.append("path")
            .attr("d", line_gen3(filterData))
            .classed("line green", true);
        
        var line3_length = line3.node().getTotalLength();
        line3.attr("stroke-dasharray", `${line3_length} ${line3_length}`)
            .attr("stroke-dashoffset", line3_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line4 = chartGroup.append("path")
            .attr("d", line_gen4(filterData))
            .classed("line lightblue", true);
        
        var line4_length = line4.node().getTotalLength();
        line4.attr("stroke-dasharray", `${line4_length} ${line4_length}`)
            .attr("stroke-dashoffset", line4_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line5 = chartGroup.append("path")
            .attr("d", line_gen5(filterData))
            .classed("line blue", true);
        
        var line5_length = line5.node().getTotalLength();
        line5.attr("stroke-dasharray", `${line5_length} ${line5_length}`)
            .attr("stroke-dashoffset", line5_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line6 = chartGroup.append("path")
            .attr("d", line_gen6(filterData))
            .classed("line purple", true);
        
        var line6_length = line6.node().getTotalLength();
        line6.attr("stroke-dasharray", `${line6_length} ${line6_length}`)
            .attr("stroke-dashoffset", line6_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line7 = chartGroup.append("path")
            .attr("d", line_gen7(filterData))
            .classed("line pink", true);
        
        var line7_length = line7.node().getTotalLength();
        line7.attr("stroke-dasharray", `${line7_length} ${line7_length}`)
            .attr("stroke-dashoffset", line7_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        // STEP 7: ADD TEXT
        chartGroup.append("text")
            .attr("x", (chart_width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "18px") 
            .style("font-weight", "bold")  
            .text("Audio Features Over Time");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .style("font-size", "14px") 
            .style("font-weight", "bold") 
            .text("Value");

        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 20})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .style("font-weight", "bold") 
            .text("Year");
        
        //STEP 8: ADD LEGEND
        //Legend code from 
        var ordinal = d3.scaleOrdinal()
            .domain(["Acousticness", "Danceability", "Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"])
            .range([ '#eb1e32', '#ffc864', '#1ED760', '#007aff', '#2d46b9', '#af2896', '#f573a0']);

        chartGroup.append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${chart_width},0)`);

        var legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
            .shapePadding(10)
            .cellFilter(function(d){ return d.label !== "e" })
            .scale(ordinal);

        svg.select("#legend")
            .call(legendOrdinal);
}

function buildHeatmap(filterData) {
    
    var timeParser = d3.timeParse("%Y");
    filterData.forEach(function(row) {
        row.year = timeParser(row.year); //cast the date string to a datetime object data type
        row.acousticness = +row.acousticness;
        row.danceability = +row.danceability;
        row.duration_ms = +row.duration_ms
        row.energy = +row.energy;
        row.instrumentalness = +row.instrumentalness;
        row.liveness = +row.liveness;
        row.loudness = +row.loudness;
        row.speechiness = +row.speechiness;
        row.valence = +row.valence;
        row.popularity = +row.popularity;
        row.key = +row.key;
        row.mode = +row.mode;
    });

    var cols = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "speechiness", "valence"];

    var corr = jz.arr.correlationMatrix(filterData, cols);
    console.log(corr);

    var bigList = [];
    cols.forEach(function(col){
        var corr_filter = corr.filter(x => x.column_x == col);
        var corr_data = corr_filter.map(x => x.correlation);
        bigList.push(corr_data);
    })
        
    var trace = {
        z: bigList,
        x: ["Acousticness", "Danceability", "Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"],
        y: ["Acousticness", "Danceability","Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"],
        type: 'heatmap',
        colorscale: 'Viridis',
        hovertemplate: '%{z}<extra></extra>',
    };

    var data = [trace];

    var layout = {
        title: {
            text: "<b>Audio Feature Heatmap</b>",
            font: {
                size: 18,
                family: "Nunito Sans",
                weight: "bold"
            }
        },
        margin: {
            l: 160,
            r: 80,
            b: 80,
            t: 30,
            pad: 10
          },
    };

    Plotly.newPlot('heatmap', data, layout);
}

function doWork() {

    d3.csv("static/data/data_by_year.csv").then(function(yearData) {
        console.log(yearData);
        //buildPlot(yearData);
        var randomItem = yearData[Math.floor(Math.random(1, 5) * yearData.length)];
        console.log(randomItem);
        // STEP 1: SET UP THE CANVAS
        $("#scatter").empty();

        var svgWidth = (window.innerWidth)-75;
        var svgHeight = 700;

        var margin = {
            top: 40,
            right: 60,
            bottom: 120,
            left: 50
        };

        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        // STEP 2: CREATE THE SVG (if it doesn't exist already)
        // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // STEP 3: PREPARE THE DATA
        yearData.forEach(function(row) {
            //row.acousticness = +row.acousticness;
            row.danceability = +row.danceability;
            row.energy = +row.energy;
            row.valence = +row.valence;
            // row.liveness = +row.liveness;
            row.popularity = +row.popularity;
            //row.speechiness = +row.speechiness;
        });

        // STEP 4: Create the Scales
        var xScale = createXScale(yearData, chart_width);
        var yScale = d3.scaleLinear()
            .domain(d3.extent(yearData, d => d.popularity))
            .range([chart_height, 0]);

        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // STEP 5.5: Create the Text
        var textGroup = chartGroup.append("g")
            .selectAll("text")
            .data(yearData)
            .enter()
            .append("text")
            .text(d => d.year)
            .attr("alignment-baseline", "central")
            .attr("font-size", 10)
            .classed("yearText", true);

        // STEP 6: CREATE THE GRAPH
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(yearData)
            .enter()
            .append("circle")
            .style("opacity", 0.50)
            .attr("stroke-width", "1")
            .classed("yearCircle", true);

        // STEP 6.5: Be extra. Have the circles fly
        chartGroup.selectAll("circle")
            .transition()
            .duration(3000)
            .attr("cx", d => xScale(d[chosen_xaxis]))
            .attr("cy", d => yScale(d.popularity))
            .attr("r", "30")
            .style("opacity", 0.50)
            .delay(function(d, i) { return i * 100 });

        chartGroup.selectAll(".yearText")
            .transition()
            .duration(3000)
            .attr("x", d => xScale(d[chosen_xaxis]))
            .attr("y", d => yScale(d.popularity))
            .delay(function(d, i) { return i * 100 });

        // STEP 7: Add Labels
        chartGroup.append("text")
            .attr("x", (chart_width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "18px") 
            .style("font-weight", "bold")  
            .text("Relationship between Audio Features and Popularity");

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .attr("class", "yearText")
            .text("Popularity")

        // CREATE FIRST XAXIS TEXT
        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText active")
            .attr("id", "danceability") // new, create id to identify text
            .text("Danceability")
            .style("cursor", "pointer")
            .on("click", function() {
                chosen_xaxis = "danceability";

                // update the x scale
                xScale = createXScale(yearData, chart_width);

                //update the x axis
                bottomAxis = d3.axisBottom(xScale);
                xAxis = createXAxis(xAxis, bottomAxis);

                // update the GROUPS that we have on the graph
                circlesGroup = updateCircles(circlesGroup, xScale);
                textGroup = updateText(textGroup, xScale);

                circlesGroup = createTooltip(circlesGroup);

                d3.select(this).classed("inactive", false);
                d3.select(this).classed("active", true);

                d3.select("#energy").classed("active", false);
                d3.select("#energy").classed("inactive", true);
                d3.select("#valence").classed("active", false);
                d3.select("#valence").classed("inactive", true);
            });

        // CREATE SECOND XAXIS TEXT
        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 50})`)
            .attr("class", "axisText inactive")
            .attr("id", "energy")
            .text("Energy")
            .style("cursor", "pointer")
            .on("click", function() {
                chosen_xaxis = "energy";

                // update the x scale
                xScale = createXScale(yearData, chart_width);

                //update the x axis
                bottomAxis = d3.axisBottom(xScale);
                xAxis = createXAxis(xAxis, bottomAxis);

                // update the GROUPS that we have on the graph
                circlesGroup = updateCircles(circlesGroup, xScale);
                textGroup = updateText(textGroup, xScale);

                circlesGroup = createTooltip(circlesGroup);

                d3.select(this).classed("inactive", false);
                d3.select(this).classed("active", true);

                d3.select("#danceability").classed("active", false);
                d3.select("#danceability").classed("inactive", true);
                d3.select("#valence").classed("active", false);
                d3.select("#valence").classed("inactive", true);
            });

        // CREATE THIRD XAXIS TEXT
        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 70})`)
            .attr("class", "axisText inactive")
            .attr("id", "valence")
            .text("Valence")
            .style("cursor", "pointer")
            .on("click", function() {
                chosen_xaxis = "valence";

                // update the x scale
                xScale = createXScale(yearData, chart_width);

                //update the x axis
                bottomAxis = d3.axisBottom(xScale);
                xAxis = createXAxis(xAxis, bottomAxis);

                // update the GROUPS that we have on the graph
                circlesGroup = updateCircles(circlesGroup, xScale);
                textGroup = updateText(textGroup, xScale);

                circlesGroup = createTooltip(circlesGroup);

                d3.select(this).classed("inactive", false);
                d3.select(this).classed("active", true);

                d3.select("#danceability").classed("active", false);
                d3.select("#danceability").classed("inactive", true);
                d3.select("#energy").classed("active", false);
                d3.select("#energy").classed("inactive", true);
            });

        // STEP 8: TOOLTIP
        circlesGroup = createTooltip(circlesGroup);


    }).catch(function(error) {
        console.log(error);
    });
}

//////////////HELPER FUNCTIONS//////////////

// create x axis scale based on chosen column
function createXScale(yearData, chart_width) {
    var xScale = d3.scaleLinear()
        .domain(d3.extent(yearData, d => d[chosen_xaxis]))
        .range([0, chart_width]);

    return xScale;
}

// transition the xaxis to the NEW chosen one
function createXAxis(xAxis, bottomAxis) {
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function updateCircles(circlesGroup, xScale) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScale(d[chosen_xaxis]));

    return circlesGroup;
}

function updateText(textGroup, xScale) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => xScale(d[chosen_xaxis]));

    return textGroup;
}

function createTooltip(circlesGroup) {
    //step 0, get label
    var label = "";
    if (chosen_xaxis == "danceability") {
        label = "danceability";
    } else if (chosen_xaxis == "valence") {
        label = "valence";
    } else {
        label = "energy";
    }

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([180, -60])
        .html(function(d) {
            //return (`<strong>${label}: ${d[chosen_xaxis]}</strong><hr><strong> danceability: ${d.danceability}</strong><hr><strong>energy: ${d.energy}</strong><hr>`);
            return (`<strong>${d.year}</strong><hr><strong>${label}: ${d[chosen_xaxis]}</strong><hr><strong> Popularity: ${d[chosen_yaxis]}</strong>`)
        });

    // Step 2: Create the tooltip in chartGroup.
    circlesGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(event, d) {
            toolTip.show(d, this);

            //make bubbles big
            d3.select(this)
                .transition()
                .duration(250)
                .attr("r", 100);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(event, d) {
            toolTip.hide(d);

            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 30);
        });

    return circlesGroup; // this is important
}