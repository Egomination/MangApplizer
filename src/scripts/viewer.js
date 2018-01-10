// Viewer window scripts

const { ipcRenderer } = require("electron");
const fs = require("fs-extra");
let path;
let arr = [];
let arr2 = []; // Use for prev-next bug

// Needed for Materialize Design
$(document).ready(function() {
    $("select").material_select();
    $(".carousel.carousel-slider").carousel({fullWidth: true, noWrap: false});
});

// Sorting function for an array of numbers
function sortNumber(a,b) {
    return a - b;
}

// Opening event of viewer window
ipcRenderer.on("open-viewer-reply", (event, mangaPath) => {
    path = mangaPath;
    // Folder listing for viewer window
    fs.readdirSync(mangaPath).forEach(file => {
        arr.push(file);
    });
    console.log("arr1:" + arr);
    arr.sort(sortNumber);
    console.log("arr2:" + arr);
    arr.forEach(item => {
        $("#chapterlist").append(
            $("<option>").attr("value", `${item}`).append(`${item}`)
        );
    });
    arr2 = arr;
    arr = [];
});

// Will list pages of said manga + IPC event to reload page
function viewManga() {
    let chapter = $("#chapterlist option:selected").val();
    let chapPath = path + chapter;
    ipcRenderer.send("open-chapter", chapPath);
}


// Ipc event that gives the path from main-viewer
ipcRenderer.on("open-chap-reply", (event, chapPath) => {
    console.log("chapPath2:" + chapPath);
    $("#chapView").empty();
    fs.readdirSync(chapPath) /*.filter(function(file) { return file.substr(-4) === ".jpg"; })*/
        .forEach(file => {
            $("#chapView").append(
                $("<a>").attr("class", "carousel-item").append(
                    $("<img>").attr("src", "../." + chapPath + "/" + file)
                )
            );
        });

});

// Page functions

function nextPage(){

    $('.carousel').carousel('next');
}

function prevPage(){
    $('.carousel').carousel('prev');
}