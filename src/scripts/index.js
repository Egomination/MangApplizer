// Main scripts

// Reqs.

// Source Loader
const fs = require('fs-extra');
const imgPath = './imgs/';
const lhscan = "./src/lib/mangasrc/lhscans.js";
const kissmanga = "./src/lib/mangasrc/kissmanga.js";
let number = 1;

$.getScript(lhscan);
$.getScript(kissmanga);	

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
    $('#View ul').append(
        $('<li>').attr('id', `src${number}`).append(`${file}`)
    );  
    number = number + 1;
});