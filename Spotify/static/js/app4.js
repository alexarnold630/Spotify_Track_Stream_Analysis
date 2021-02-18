$(document).ready(function() {

    buildTable();
    //Event Listeners
    $("#filter-btn").on("click", function(e) {
        e.preventDefault();
        buildTable();
    });
    $("#filter-clear").on("click", function(e) {
        e.preventDefault();
        resetFilters();
        buildTable();
    });
    $("#form").on("submit", function(e) {
        e.preventDefault();
        buildTable();
    });   
}); 

function resetFilters() {
    $("#streams").val("All");

}

function buildUniqueFilterHelper(colName, filterID) {
    var unq_column = [...new Set(table_data.map(x => x[colName]))];
    unq_column = unq_column.sort();
    unq_column.forEach(function(val) {
        var newOption = `<option>${val.toUpperCase()}</option>`;
        $(`#${filterID}`).append(newOption);
    });
}


function buildTable() {
    d3.csv("static/data/Top_Streams_2020.csv").then(function(allData) {
        console.log(allData); 
        var streamFilter = $("#streams").val(); //gets input value to filter
        allData.forEach(function(row) {
            row.Streams = +row.Streams;
        }); 
        var streamsData = allData
        // apply filters
        if(streamFilter == "Top 10") {
            streamsData = allData.sort((a,b) => b.Streams - a.Streams).slice(0,10); 
        } else if (streamFilter == "Top 50") {
            streamsData = allData.sort((a,b) => b.Streams - a.Streams).slice(0,50); 
        } else if (streamFilter == "Bottom 10") {
            streamsData = allData.sort((a,b) => a.Streams - b.Streams).slice(0,10);       
        } else if (streamFilter == "Bottom 50") {
            streamsData = allData.sort((a,b) => a.Streams - b.Streams).slice(0,50);       
        }
        else {
            streamsData = allData
        }

    buildTableString2(streamsData);
})
}; 

function buildTableString2(allData) {

        // JQUERY creates an HTML string
        var tbody = $("#table>tbody");
        //clear table
        tbody.empty();

        //destroy datatable
        $("table").DataTable().clear().destroy();

        //append data
        allData.forEach(function(row) {
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
