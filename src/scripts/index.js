// Main scripts

// TODO: Add button to index.html !!! Which also means you have to use same func name for every button script which is also not a problem... !!!
// TODO: Find a potential way to stop loading scripts from different html files.

// Needed for Materialize Design
$(document).ready(function() {
    $('select').material_select();
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
});

// Loads respective source buttons
function source(source) {
    if (source == "lhs") {
        $("#content").load("./src/components/lhscans.html");
        console.log("lhs")
        resetBtt();
    } else if (source == "km") {
        $("#content").load("./src/components/kissmanga.html");
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