$(document).ready(function() {
    makeMap();
    var selectionFilter = $("#data_columns").val();
    readStreamsData(selectionFilter);
    
    //Event Listener
    $("#data_columns").on("change", function() {
        var selectionFilter = $("#data_columns").val();
        readStreamsData(selectionFilter);
    });

    $(window).resize(function() {
        makeMap();
        var selectionFilter = $("#data_columns").val();
        readStreamsData(selectionFilter);
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

    // d3.csv("static/data/data_by_genres.csv").then(function(byGenresData) {
    //     console.log(byGenresData);
    //     //buildPlot(byGenresData);
    // });

//     // d3.csv("static/data/data_by_year.csv").then(function(yearData) {
//     //     console.log(yearData);
//     //     //buildPlot(yearData);
//     // });

    d3.csv("static/data/data_w_genres.csv").then(function(genreData) {
        console.log(genreData);
       // buildBubbleChart(genreData);
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
        }
        //console.log(rows);
        var data = [{
                type: 'choropleth',
                locations: unpack(rows, 'Region'),
                z: unpack(rows, 'Total Streams'),
                text: unpack(rows, 'Country'),
                hovertemplate: '%{text}: %{z}<extra></extra>',
                colorscale: "Viridis",
            }];
            var layout = {
                title: '<b>Total Streams per Country</b>',
                geo: {
                    projection: {
                        type: 'orthographic'
                    }
                },
                hovermode: "closest",
                font: {
                    size: 14,
                    family: "Nunito Sans",
                    weight: "bold"
                }
            }
        Plotly.newPlot("map", data, layout, {showLink: false});
    });
}

function readStreamsData(selectionFilter) {
    d3.csv("static/data/Top_Streams_2020.csv").then(function(streamsData) {
        console.log(streamsData);

        streamsData.forEach(function(row) {
            row.Streams = +row.Streams;
        });

        var barData = streamsData;
        if(selectionFilter == "Top 10"){
            barData = streamsData.sort((a,b) => b.Streams - a.Streams).slice(0,10);
        } else if (selectionFilter == "Top 20"){
            barData = streamsData.sort((a,b) => b.Streams - a.Streams).slice(0,20);
        } else if (selectionFilter == "Bottom 10"){
            barData = streamsData.sort((a,b) => a.Streams - b.Streams).slice(0,10);
        } else {
            barData = streamsData.sort((a,b) => a.Streams - b.Streams).slice(0,20);
        }

        buildBarchart(barData);
    });
}

function buildBarchart(barData){

        var trace = {
            x: barData.map( x => x["Track Name"]),
            y: barData.map( x => x.Streams),
            text: barData.map(x =>x.Artist),
            hovertemplate: '%{text}: %{y}<extra></extra>',
            type: 'bar',
            marker: {
                color: "#1ED760",
            }
        };

        var data = [trace];
    
        var layout = {
            title: "<b>2020 Streams by Track</b>",
            xaxis: {
                type: "category",
                title: "<b>Track Name</b>",
                tickvals: barData.map( x => x["Track Name"]),
                ticktext: barData.map( x => x["Track Name"].slice(0,7)+"..."),
                //ticktext: barData.map( x => x["Track Name"]),
                font: {
                    size: 14,
                }
            },
            yaxis: {
                title: "<b>No. Streams (in billions)</b>",
                font: {
                    size: 14,
                }
            },
            color:  "#1ED760",
            margin: {
                l: 80,
                r: 80,
                b: 80,
                t: 30,
                pad: 0
              },
            font: {
                size: 14,
                family: "Nunito Sans",
                weight: "bold"
            }
        };
          
          Plotly.newPlot('bar', data, layout);
    };  


// function buildBubbleChart(genreData) {

//     genreData.forEach(function(row) {
//         row.acousticness = +row.acousticness;
//         row.danceability = +row.danceability;
//         row.duration_ms = +row.duration_ms
//         row.energy = +row.energy;
//         row.instrumentalness = +row.instrumentalness;
//         row.liveness = +row.liveness;
//         row.loudness = +row.loudness;
//         row.speechiness = +row.speechiness;
//         row.tempo = +row.tempo;
//         row.valence = +row.valence;
//         row.popularity = +row.popularity;
//         row.key = +row.key;
//         row.mode = +row.mode;
//     });

//     var trace1 = {
//         x: genreData.map( x => x.Popularity),
//         y: genreData.map( x => x.Count),
//         //text: sample_data.otu_labels.map(String),
//         mode: 'markers',
//         marker: {
//         color: byGenresData.map( x => x.genres),
//         opacity: [1, 0.8, 0.6, 0.4],
//         size: genreData.map( x => x.Count)
//         }
//     };

//     var data = [trace1];

//     var layout = {
//         title: '<b>Genre Popularity<b>',
//         showlegend: true,
//         height: 600,
//         width: 1000,
//         yaxis: {title: "Number of Songs"},
//         xaxis: {title: "Popularity"}
//     };

//     Plotly.newPlot('bubble', data, layout);
