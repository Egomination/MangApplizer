// Main scripts

// TODO: Add a special rule for non-source form so that user cant write something.

// Source Loader
const lhscan = "./src/lib/mangasrc/lhscans.js";
const kissmanga = "./src/lib/mangasrc/kissmanga.js";

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
    $("form input").on("keyup change", function() {

        let empty = false;
        $('form input').each(function() {
            // Check is any input value is empty
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
})()

// Reset Button
function resetBtt() {
    $('form[name="downloadForm"]')
        .find(":input").val("");
    $('#butto-kun').attr('disabled', 'disabled');
}