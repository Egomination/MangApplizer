// Main scripts

// Reqs.

// Source Loader
const fs = require('fs-extra');
const imgPath = "./imgs/";
const lhscan = "./src/lib/mangasrc/lhscans.js";
const kissmanga = "./src/lib/mangasrc/kissmanga.js";
const viewer = "./src/lib/mangasrc/viewer.js"

$.getScript(lhscan);
$.getScript(kissmanga);	
$.getScript(viewer);	


// Needed for Materialize Design
$(document).ready(function() {
    $('select').material_select();
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
});

// Loads respective source buttons
function source(source) {
    if (source == "lhs") {
        //$("#content").load("./src/components/lhscans.html");
        $('#butto-kun').attr('onclick', 'lhs(); return false;'); 
        console.log("lhs")
        resetBtt();
    } else if (source == "km") {
        //$("#content").load("./src/components/kissmanga.html");
        $('#butto-kun').attr('onclick', 'buttoKun(); return false;'); 
        console.log("km")
        resetBtt();
    }
}

// Grey out the button if at least one input is missing
(function() {
    $('#butto-kun').attr('disabled', 'disabled');
    $("form input").on("keyup change", function() {

        let empty = false;
        $('form input').each(function() {
            // Check if any input value is empty
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#butto-kun').attr('disabled', 'disabled');
        } else {
            $('#butto-kun').removeAttr('disabled');
        }
    });
})();

// Disable form if no source is selected
(function() {
    $("#downloadForm :input").prop("disabled", true);
    $('#selector').on('change', function() {
        if ($('#selector option:selected').prop("disabled") == true){
            $("#downloadForm :input").prop("disabled", true);
        } else {
            $("#downloadForm :input").prop("disabled", false);
        }
    });
})();

// Reset Button
function resetBtt() {
    $('form[name="downloadForm"]')
        .find(":input").val("");
    $('#butto-kun').attr('disabled', 'disabled');
}

fs.readdirSync(imgPath).forEach(file => {
    //$("#chapterlist").attr('disabled', 'disabled');
    $('#sourcelist').append(
        $('<option>').attr('value', `${file}`).append(`${file}`)
    );  
});

/*
function viewer(manga) {
    //$("#chapterlist").removeAttr('disabled');
    console.log(manga);
    $("#content").load("./den.html");
    if(manga){
        let mangaPath = `./imgs/${manga}`;
        console.log(mangaPath);
        $("#chapterlist").append("<option></option>");
        fs.readdirSync(mangaPath).forEach(file2 => {
            console.log(file2);
            $('#chapterlist').append(
                $('<option>').attr('value', `${file2}`).append(`${file2}`)
            );
        });    
    }
}*/

/*
$("#sourcelist").change(function() {
    let manga = $("#sourcelist option:selected").val();
    console.log(manga);
    let mangaPath = `./imgs/${manga}`;
    let chapArr = [];
    console.log(mangaPath);
    $("#chapterlist").empty();
    $("#chapterlist").append("<option disabled selected>Please select a chapter</option>");
    fs.readdirSync(mangaPath).forEach(file2 => {
        console.log(file2);
        chapArr.push(file2);
    });
    console.log(chapArr);
    $(chapArr).each(function(i) { //to list cities
        $("#chapterlist").append("<option>" + chapArr[i] + "</option>")
    });
});*/