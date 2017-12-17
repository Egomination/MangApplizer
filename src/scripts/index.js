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
    $("#downloadForm input").on("keyup change", function() {

        let empty = false;
        $('#downloadForm input').each(function() {
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
fs.readdirSync(imgPath).forEach(file => {
    $("#sourcelist").append(
        $("<option>").attr("value", `${file}`).append(`${file}`)
    );  
});

function openViewer(){
    let sourceVal = $("#sourcelist option:selected").val();
    console.log(sourceVal);
    let mangaPath = imgPath + sourceVal + "/";
    console.log(mangaPath);
    /*let chapNo = $("#vChapNo").val();
    console.log(chapNo);
    let chapterPath = mangaPath + chapNo + "/";
    console.log(chapterPath);*/
    ipcRenderer.send('open-viewer', 'viewer', mangaPath);
}