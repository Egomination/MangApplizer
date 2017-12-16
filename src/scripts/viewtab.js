// Viewer window scripts

const {ipcRenderer} = require('electron');

// Needed for Materialize Design
$(document).ready(function(){
    $('.carousel.carousel-slider').carousel({fullWidth: true});
});

/*
function test(){
    ipcRenderer.on('send-to-viewer', (event, payload) => {
        console.log(payload);
});
}*/

ipcRenderer.on('send-to-viewer', (event, data) => {
    console.log("Path:" + data);
});

function test(){
    console.log(data);
}