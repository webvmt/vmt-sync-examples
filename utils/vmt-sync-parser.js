/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

function parseVmt(req) {
    //console.log('parseVmt: ' + isInit);
    var cueList = [];
    
    // sanity check
    if (!req.startsWith('WEBVMT')) { // not first line
        console.error('Missing WEBVMT');
        return cueList;
    }
    
    // parse blocks
    var blocks = req.split('\n\n'); // block separator
    var preCue = true;
    //console.log('parseVmt: parse ' + blocks.length + ' blocks');
    for (var b = 0; b < blocks.length; b++) {
        var block = blocks[b];
        var line = block.split('\n');
        var blockLen = line.length;
        if (blockLen == 1 && line[0] == '') {
            continue; // ignore spurious newline
        }
        if (block.startsWith('NOTE')) {
            continue; // ignore comments
        }
        if (preCue) {
            if (block.includes('-->')) { // first cue found
                preCue = false;
            } // ignore header
        }
        
        if (!preCue) { // cue
            var cue = parseCue(block, blockLen, line);
            if (cue != null) { // valid
                cueList.push(cue);
            } else { // invalid
                console.error('Bad cue\n');
            }
        }
    }
    return cueList;
}

function parseCue(block, blockLen, line) {
    var cue = null;
    var payloadStart = block.indexOf('\n') + 1; // skip 1st line
    if (line[0].includes('-->')) { // timestamp 1st
        cue = parseCueTimes(line[0]);
        cue.payload = block.substring(payloadStart, block.length);
    } else if (blockLen > 1 && line[1].includes('-->')) { // id 1st, timestamp 2nd
        cue = parseCueTimes(line[1]);
        cue.id = line[0].trim();
        payloadStart = block.indexOf('\n', payloadStart) + 1; // skip 2nd line
        cue.payload = block.substring(payloadStart, block.length);;
    }
    return cue;
}

function parseCueTimes(cueTimings) {
    var timestamp = cueTimings.split('-->');
    var time = {};
    time.start = cueSecs(timestamp[0]);
    if (timestamp[1]) { // if present
        time.end = cueSecs(timestamp[1]);
    } else {
        time.end = Infinity;
    }
    return time;
}

function cueSecs(cueTime) {
    var ms = cueTime.split('.');
    var hms = ms[0].split(':');
    var secs = Math.floor(Math.abs(hms[0])) * 60 + Math.floor(hms[1]);
    if (hms.length == 3) { // hours optional
        secs = secs * 60 + Math.floor(hms[2]);
    }
    secs += ms[1] / 1000;
    if (hms[0].indexOf('-') != -1) { // negative
        secs = -secs;
    }
    return secs;
}

function parseCuePayload(cue) {
    // add payload elements to list
    var jsonList = parseBlock(cue.payload);
    var cmdList = [];

    // parse elements list
    for (var t = 0; t < jsonList.length; t++) {
        try {
            const obj = JSON.parse(jsonList[t]);
            // identify command
            const tag = parseTag(obj);
            cmdList.push(tag);
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error('Parsing error\n');
                console.error(jsonList[t] + '\n');
            } else {
                console.error(e.name + ': ' + e.message + '\n');
            }
        }
    }
    return cmdList;
}

function parseBlock(block) {
    var results = new Array();
    var open = 0;
    var close = 0;
    var nested = 0;
    var start = 0;
    for (var i = 0; i < block.length; i++) {
        if (block.charAt(i) == '{') { // open
            if (nested == 0) { // start
                start = i;
            }
            nested++;
            open++;
        } else if (block.charAt(i) == '}') { // close
            nested--;
            close++;
            if (nested == 0) { // end
                results.push(block.substring(start, i + 1));
            }
        }
    }
    if (open != close) {
        var missing = open - close;
        if (missing > 0) {
            console.error('Parenthesis mismatch: extra open or missing close\n');
        } else {
            console.error('Parenthesis mismatch: extra close or missing open\n');                
        }
    }
    return results;
}

function parseTag(obj) {
    var tag = {};
    // parse sync tag
    if (obj.hasOwnProperty('sync')) { // valid
        // parse attributes
        tag = parseAttribs(obj.sync, {type: 0, id:1, data: 2, end: 3, dur: 4});
        tag.name = 'sync';
        // add end if required
        if (!tag.hasOwnProperty('end')) {
            tag.end = null; // instant
        }
    } else { // error
        console.error('Unknown tag: ' + firstProp(obj) + '\n');
    }
    return tag;
}

function parseAttribs(obj, tag) {
    var attribs = {};
    for (var a in tag) {
        if (obj.hasOwnProperty(a)) {
            if (a == 'end' || a == 'dur') {
                attribs[a] = cueSecs(obj[a]); // convert to time
            } else {
                attribs[a] = obj[a]; // copy
            }
        }
    }
    return attribs;
}

function getSyncTime(syncEnd, cueStart) {
    return (syncEnd != undefined ? syncEnd : cueStart);
}