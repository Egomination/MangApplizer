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

function openViewer(){
    ipcRenderer.send('open-new-window', 'viewer');
}