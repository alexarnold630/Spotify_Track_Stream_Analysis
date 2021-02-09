$(document).ready(function() {
    //doWork();
    makeMap();
    readYearData(-1);
    buildBarchart();
    

    //Event Listener
    $("#decade").change(function(){
        var filter = $("#decade").val();
       readYearData(filter);
    });
});


function makePlots() {
    d3.csv("static/data/data_by_artist.csv").then(function(artistData) {
        console.log(artistData);
        //buildHeatmap(artistData);
    });

    // d3.csv("static/data/data.csv").then(function(trackData) {
    //     console.log(trackData);
    //     buildBarchart(trackData);
    // });

//     // d3.csv("static/data/data_by_genres.csv").then(function(byGenresData) {
//     //     console.log(byGenresData);
//     //     //buildPlot(byGenresData);
//     // });

//     // d3.csv("static/data/data_by_year.csv").then(function(yearData) {
//     //     console.log(yearData);
//     //     //buildPlot(yearData);
//     // });

    d3.csv("static/data/data_w_genres.csv").then(function(genreData) {
        console.log(genreData);
        buildBubbleChart(genreData);
    });

    // d3.csv("static/data/Top_Streams_2020.csv").then(function(streamsData) {
    //     console.log(streamsData);
    //     buildBarchart(streamsData);
    // });

//     // d3.csv("static/data/world_map_streaming.csv").then(function(worldStreamsData) {
//     //     console.log(worldStreamsData);
//     //     //buildPlot(worldStreamsData);
//     // });
}

function makeMap() {
    Plotly.d3.csv('static/data/streamsbyCountry.csv', function(err, rows){
        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        };

        var data = [{
                type: 'choropleth',
                locations: unpack(rows, 'Region'),
                z: unpack(rows, 'Total Streams'),
                text: unpack(rows, 'Country'),
                autocolorscale: true
            }];
        
            var layout = {
                title: 'Total Streams per Country',
                geo: {
                    projection: {
                        type: 'orthographic'
                    }
                }
            };
        Plotly.newPlot("map", data, layout, {showLink: false});
    });
}

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
            right: 40,
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

        // var yScale1 = d3.scaleLinear()
        //     .domain([0, col1_max])
        //     .range([chart_height, 0]);

        // var yScale2 = d3.scaleLinear()
        //     .domain([0, col2_max])
        //     .range([chart_height, 0]);

        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        //var leftAxis = d3.axisLeft(yScale1);
        //var rightAxis = d3.axisLeft(yScale2);
        var bottomAxis = d3.axisBottom(xScale); // cast the datetime back to a string for display (only for time series)

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // chartGroup.append("g")
        //     .attr("transform", `translate(${chart_width}, 0)`)
        //     // .attr("stroke", "purple")
        //     .call(rightAxis);
        
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
            .classed("line orange", true);
        
        var line2_length = line2.node().getTotalLength();
        line2.attr("stroke-dasharray", `${line2_length} ${line2_length}`)
            .attr("stroke-dashoffset", line2_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line3 = chartGroup.append("path")
            .attr("d", line_gen3(filterData))
            .classed("line yellow", true);
        
        var line3_length = line3.node().getTotalLength();
        line3.attr("stroke-dasharray", `${line3_length} ${line3_length}`)
            .attr("stroke-dashoffset", line3_length)
            .transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);
        
        var line4 = chartGroup.append("path")
            .attr("d", line_gen4(filterData))
            .classed("line green", true);
        
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
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 20})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "green")
            .text("Acoustiness");
        
        //STEP 8: ADD LEGEND
        var ordinal = d3.scaleOrdinal()
        .domain(["acousticness", "danceability", "energy", "instrumentalness", "liveness", "speechiness", "valence"])
        .range([ "red", "orange", "yellow", "green", "blue", "purple", "pink"]);

        var svg = d3.select("svg");

        svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(20,20)");

        var legendOrdinal = d3.legendColor()
        //d3 symbol creates a path-string, for example
        //"M0,-8.059274488676564L9.306048591020996,
        //8.059274488676564 -9.306048591020996,8.059274488676564Z"
        .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
        .shapePadding(10)
        //use cellFilter to hide the "e" cell
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
        type: 'heatmap'
    };

    var data = [trace];

    var layout = {
        title: "Audio Feature Heatmap"
    }

    Plotly.newPlot('heatmap', data, layout);
}

function buildBarchart(){

    d3.csv("static/data/Top_Streams_2020.csv").then(function(streamsData) {
        console.log(streamsData);
        streamsData.forEach(function(row) {
            row.Streams = +row.Streams;
        });

        streamsData = streamsData.sort((a,b) => b.Streams - a.Streams).slice(0,10);
        var trace = {
            x: streamsData.map( x => x.Artist),
            y: streamsData.map( x => x.Streams),
            type: 'bar'
        }
        var data = [trace];
    
        var layout = {
            title: "Top Streams of 2020",
            xaxis: {
                type: "category"
            }
        };
          
          Plotly.newPlot('bar', data, layout);
        //buildBarchart(streamsData);
    });  
};

function buildBubbleChart(genreData) {

    genreData.forEach(function(row) {
        row.acousticness = +row.acousticness;
        row.danceability = +row.danceability;
        row.duration_ms = +row.duration_ms
        row.energy = +row.energy;
        row.instrumentalness = +row.instrumentalness;
        row.liveness = +row.liveness;
        row.loudness = +row.loudness;
        row.speechiness = +row.speechiness;
        row.tempo = +row.tempo;
        row.valence = +row.valence;
        row.popularity = +row.popularity;
        row.key = +row.key;
        row.mode = +row.mode;
    });
    
    var trace1 = {
        x: genreData.popularity,
        y: genreData.count,
        //text: sample_data.otu_labels.map(String),
        mode: 'markers',
        marker: {
        color: genreData.genres,
        opacity: [1, 0.8, 0.6, 0.4],
        size: genreData.count
        }
    };

    var data = [trace1];

    var layout = {
        title: '<b>Genre Popularity<b>',
        showlegend: true,
        height: 600,
        width: 1000,
        yaxis: {title: "Number of Songs"},
        xaxis: {title: "Popularity"}
    };

    Plotly.newPlot('bubble', data, layout);
}

