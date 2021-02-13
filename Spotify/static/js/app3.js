
$(document).ready(function() {
    // var dateFilter = $("#year").val(); //gets input value to filter
    buildTable(); 
    // buildTable(dateFilter);
    //Event Listeners
    $("#filter-btn").on("click", function(e) {
        e.preventDefault();
        buildTable();
    });
    $("#filter-clear").on("click", function(e) {
        e.preventDefault();
        resetFilters();
    });
    $("#form").on("submit", function(e) {
        e.preventDefault();
        buildTable();
    });   
}); 

function resetFilters() {
    $("#year").val("");
    $("#year").text("");
}

function buildTable() {
    d3.csv("static/data/data_by_year.csv").then(function(yearData) {
        
        var dateFilter = $("#year").val();
        yearData.forEach(function(row) {
            row.acousticness = parseFloat(row.acousticness).toFixed(2);
            row.danceability = parseFloat(row.danceability).toFixed(2);
            row.duration_ms = parseFloat(row.duration_ms).toFixed(2);
            row.energy = parseFloat(row.energy).toFixed(2);
            row.instrumentalness = parseFloat(row.instrumentalness).toFixed(2);
            row.liveness = parseFloat(row.liveness).toFixed(2);
            row.loudness = parseFloat(row.loudness).toFixed(2)
            row.speechiness = parseFloat(row.speechiness).toFixed(2);
            row.tempo =  parseFloat(row.tempo).toFixed(2)
            row.valence = parseFloat(row.valence).toFixed(2);
            row.popularity = parseFloat(row.popularity).toFixed(2)
            row.key = parseFloat(row.key).toFixed(2)
            row.mode = parseFloat(row.mode).toFixed(2)
        
        // apply filters
       var filteredData = yearData
        if (dateFilter) {
            filteredData = filteredData.filter(row => Date.parse(row.year) === Date.parse(dateFilter));
            }
        // // see if we have any data left
        if (filteredData.length === 0) {
            alert("No Data Found!");
        }
    buildTableString(filteredData);
    }); 
    }); 
}

function buildTableString(yearData) {

        // JQUERY creates an HTML string
        var tbody = $("#table>tbody");
        //clear table
        tbody.empty();

        //destroy datatable
        $("table").DataTable().clear().destroy();

        //append data
        yearData.forEach(function(row) {
            var newRow = "<tr>"
                // loop through each Object (dictionary)
            Object.entries(row).forEach(function([key, value]) {
                // set the cell data
                newRow += `<td>${value}</td>`
            });

            //append to table
            newRow += "</tr>";
            tbody.append(newRow);
    
    });

    //redraw
    $("#table").DataTable({
        "pageLength": 10, 
        dom: 'Bfrtip', //lbfrtip if you want the length changing thing
        buttons: [
            { extend: 'copyHtml5' },
            { extend: 'excelHtml5' },
            { extend: 'csvHtml5' },
            {
                extend: 'pdfHtml5',
                title: function() { return "Spotify Data"; },
                orientation: 'portrait',
                pageSize: 'LETTER',
                text: 'PDF',
                titleAttr: 'PDF'
            }
        ]
    });
}; 
