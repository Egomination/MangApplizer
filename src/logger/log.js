/* Check out the winston.js for logger module*/
// TODO: Add time stamps
// TODO: Add definitions for custom error codes Like 404
const json = require("./json");
module.exports = class Logger {
    constructor() {
        console.log("Logger called");
    }
    /**
     * Utilizing the colours
     * @param  {Function} callback Data
     * @return {void}
     */
    colorTable(callback) {
        const colours = {
            Reset: "\x1b[0m",
            Bright: "\x1b[1m",
            Dim: "\x1b[2m",
            Underscore: "\x1b[4m",
            Blink: "\x1b[5m",
            Reverse: "\x1b[7m",
            Hidden: "\x1b[8m",
            // Foreground colours.
            FgBlack: "\x1b[30m",
            FgRed: "\x1b[31m",
            FgGreen: "\x1b[32m",
            FgYellow: "\x1b[33m",
            FgBlue: "\x1b[34m",
            FgMagenta: "\x1b[35m",
            FgCyan: "\x1b[36m",
            FgWhite: "\x1b[37m",
            // Background colours.
            BgBlack: "\x1b[40m",
            BgRed: "\x1b[41m",
            BgGreen: "\x1b[42m",
            BgYellow: "\x1b[43m",
            BgBlue: "\x1b[44m",
            BgMagenta: "\x1b[45m",
            BgCyan: "\x1b[46m",
            BgWhite: "\x1b[47m"
        };
        callback(null, colours);
        // console.log(colours);
    }

    /**
     * Json api func
     * @param  {String} mangaName Name of the Manga
     * @param  {Integer} chapterNo Number of the chapter
     * @param  {String} src       Name of the manga source
     * @return {void}
     */
    saveAsJson(mangaName, chapterNo, src) {
        json(mangaName, chapterNo, src);
    }

    /**
     * Main log method for generating readable logs
     * @param  {String} name      Name of the manga source
     * @param  {String} mangaName Name of the manga
     * @param  {Integer} mangaChNo Number of the chapter
     * @return {void}
     */
    logRun(name, mangaName, mangaChNo) {
        const obj = {
            Host: name,
            Manga: mangaName,
            Chapter: mangaChNo
        };
        this.colorTable((error, colours) => {
            const Manga = obj.Manga;
            const Chapter = obj.Chapter;
            const Source = obj.Host;
            console.log(Logger.name);
            console.log(colours.BgBlue + Manga + ": " + colours.BgYellow + Chapter +
                colours.Reset + " from " + colours.BgRed + Source + colours.Reset);
            this.saveAsJson(Manga, Chapter, Source);
        });
    }

    /**
     * Custom console warning method
     * @param {String} header Specific Warning name. Can be null as well.
     * @param {String} input  Warning description
     * @return {void}
     */
    Warning(header, input) {
        header = header || "Warning";
        this.colorTable((error, colour) => {
            let rowColumn = ((new Error().stack).split("at ")[4]).trim();
            rowColumn = rowColumn.split("/").pop(-1);
            rowColumn = rowColumn.split(")")[0];
            console.log(" " + colour.Dim + rowColumn + " " + colour.Reset +
                colour.Bright + colour.FgYellow + header + " " +
                colour.Reset + colour.Bright + input + colour.Reset);
        });
    }
    /**
     * Custom console error method
     * @param {Integer} error Error code. Can be null as well.
     * @param {String} text  Error description.
     * @return {void}
     */
    Error(error, text) {
        error = error || "Error";
        this.colorTable((err, colour) => {
            let rowColumn = ((new Error().stack).split("at ")[4]).trim();
            rowColumn = rowColumn.split("/").pop(-1);
            rowColumn = rowColumn.split(")")[0];
            console.log(" " + colour.Dim + rowColumn + " " + colour.Reset +
                colour.Blink + colour.FgRed + error + " " +
                colour.Reset + colour.Bright + text + colour.Reset);
        });
    }
};