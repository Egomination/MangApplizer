// Main scripts

// Reqs.

const fs = require('fs-extra');
const mkdirp = require('mkdirp-promise');
const http = require('http');
const {ipcRenderer} = require('electron');
const imgPath = "./imgs/";

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
        $('#butto-kun').attr('onclick', 'lhs()'); 
        console.log("lhs")
        resetBtt();
    } else if (source == "km") {
        //$("#content").load("./src/components/kissmanga.html");
        $('#butto-kun').attr('onclick', 'buttoKun()'); 
        console.log("km")
        resetBtt();
    }
}

// Grey out the button if at least one input is missing
(function() {
    $('#butto-kun').prop('disabled', 'disabled');
    $("#downloadForm input").on("keyup change", function() {

        let empty = false;
        $('#downloadForm input').each(function() {
            // Check if any input value is empty
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#butto-kun').prop('disabled', 'disabled');
        } else {
            $('#butto-kun').removeAttr('disabled');
        }
    });
})();

// Disable download form if no source is selected
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

// Folder listing for Viewertab
try{
    fs.readdirSync(imgPath).forEach(file => {
        $("#sourcelist").append(
            $("<option>").attr("value", `${file}`).append(`${file}`)
        );  
    });
}catch(err){
    // pass
}

// Grey out the View button if no manga is selected
(function() {
    $("#vButto").prop("disabled", true);
    $('#sourcelist').on('change', function() {
        if ($('#sourcelist option:selected').prop("disabled") == true){
            $("#vButto").prop("disabled", true);
        } else {
            $("#vButto").prop("disabled", false);
        }
    });
})();

function openViewer(){
    let sourceVal = $("#sourcelist option:selected").val();
    let mangaPath = imgPath + sourceVal + "/";
    ipcRenderer.send('open-viewer', 'viewer', mangaPath);
}