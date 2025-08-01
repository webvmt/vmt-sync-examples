/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

function loadVmtFile(src, callback) {
    // parse file on load complete
    const onLoaded = function(req) {
        const vmt = parseVmt(req);
        if (vmt == []) {
            console.error('Could not parse: ' + src);
        }
        callback(vmt);
    };

    if (src != null) {
        // load VMT file
        getHtmlUrlAsync(src, onLoaded);
    }
}

function getHtmlUrlAsync(url, callback) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200) { // success
            callback(req.responseText);
        }
    };
    req.open('GET', url, true); // async
    req.overrideMimeType('text/vmt'); // prevent xml parsing error
    req.send(null);
}
