const imgPath = "./imgs/";
// NOTE: Add this to index.js for further electron uses
const {ipcRenderer} = require('electron');

// Folder listing for Viewer
fs.readdirSync(imgPath).forEach(file => {
    $("#sourcelist").append(
        $("<option>").attr("value", `${file}`).append(`${file}`)
    );  
});

// Prevents clicking view button if no chapter is given
/*
(function() {
    $("#vButto").attr("disabled", "disabled");
    $("#viewerForm input").on("keyup change", function() {

        let empty = false;
        $("#viewerForm input").each(function() {
            // Check if any input value is empty
            if ($(this).val() == "") {
                empty = true;
            }
        });

        if (empty) {
            $("#vButto").attr("disabled", "disabled");
        } else {
            $("#vButto").removeAttr("disabled");
        }
    });
})();*/

$("#sourcelist").change(function() {
    let manga = $("#sourcelist option:selected").val();
    console.log(manga);
    let mangaPath = `./imgs/${manga}`;
    let chapArr = [];
    console.log(mangaPath);
    fs.readdirSync(mangaPath).forEach(file2 => {
        console.log(file2);
        chapArr.push(file2);
    });
    ipcRenderer.send('send-chap', chapArr, manga);
});

ipcRenderer.on('send-chap-reply', (event, data, data2) => {
    console.log("Send");
    $("#maintab").removeClass("active");
    $("#viewtab").addClass("active");
    $("#chapterlist").empty();
    $("#chapterlist").append('<option value="nul" disabled selected>Please select a chapter</option>');
    $(data).each(function(i) { //to list cities
        $("#chapterlist").append("<option>" + data[i] + "</option>")
    });   
    console.log("Send done");
});


/*
function openViewer(){
    let sourceVal = $("#sourcelist option:selected").val();
    console.log(sourceVal);
    let mangaPath = imgPath + sourceVal + "/";
    console.log(mangaPath);
    let chapNo = $("#vChapNo").val();
    console.log(chapNo);
    let chapterPath = mangaPath + chapNo + "/";
    console.log(chapterPath);
    ipcRenderer.send('open-viewer', 'viewer', chapterPath);
}*/