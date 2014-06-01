
$(function() {

    // Populate using an object literal

    // WTF.init({
    //     "heading": [
    //         "My ITP Camp Project is",
    //     ],

    //     "response": [
    //         "Nice work",
    //         "Give me a-fucking-nother one",
    //         "Don't really give a fuck"
    //     ],

    //     "template": [
    //         "@concept @type made with @tech and @material",
    //     ],

    //     "concept": [
    //         "Climate change",
    //         "Programmable furniture",
    //     ],

    //     "type": [
    //         "web site",
    //         "sculpture",
    //         "installation",
    //         "data visualization",
    //         "app"
    //     ],

    //     "tech": [
    //         "ardunio",
    //         "LEDs",
    //         "Processing",
    //         "openFrameworks",
    //         "Cinder",
    //         "javascript",
    //         "python",
    //         "a kinect",
    //     ],

    //     "material": [
    //         "paper",
    //         "cardboard",
    //         "glue",
    //         "ink"
    //     ]
    // });

    // Populate using a JSON file
    WTF.init( 'itp.json' );

    // Populate using a Google spreadsheet ID (you must publish it first!)
    // @see https://support.google.com/drive/answer/37579?hl=en
    // WTF.init( '0AvG1Hx204EyydF9ub1M2cVJ3Z1VGdDhTSWg0ZV9LNGc' );

});