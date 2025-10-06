/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

const SECS_DP = 3;

//let toString = obj => Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');
var toString = obj => Object.entries(obj).map(([k, v]) => typeof v == 'object' ? `${k}: {${toString(v)}}` : `${k}: ${v}`).join(', ');

function setExampleOptions(defaults) {
    var options = defaults; // defaults
    try { // reference may be undefined
        if (vmtSyncExample) { // set options
            for (const o in vmtSyncExample) {
                options[o] = vmtSyncExample[o];
            }
        }
    } catch (error) {
        // ignore error
    }
    return options;
}

function getLatestStartTime(cueList) {
    var latestStartTime = -Infinity;
    for (const cue of cueList) {
        if (cue.startTime > latestStartTime) {
            latestStartTime = cue.startTime;
        }
    }
    return latestStartTime;
}

function syncToCues(vmtSync, allowCustomCues) {
    var cues = [];
    for (var s = 0; s < vmtSync.length; s++) {
        const dataCues = parseCuePayload(vmtSync[s]);
        for (var c = 0; c < dataCues.length; c++) {
            var cue = {start: vmtSync[s].start, end: vmtSync[s].end}
            if (allowCustomCues) {
                switch (dataCues[c].type) {
                    case 'org.webvmt.example.count':
                        cue.class = CountCue;
                        cue.content = dataCues[c].data;
                        break;

                    case 'org.webvmt.example.colour':
                        cue.class = ColourCue;
                        cue.content = dataCues[c].data;
                        break;

                    default:
                        cue.class = DataCuePolyfill;
                        cue.content = {type: dataCueType(dataCues[c]), value: dataCues[c].data};
                        break;
                }
            } else {
                cue.class = DataCuePolyfill;
                cue.content = {type: dataCueType(dataCues[c]), value: dataCues[c].data};
            }
            cues.push(cue);
        }
    }
    return cues;
}

function dataCueType(sync) {
    return (sync.hasOwnProperty('id') ? sync.type + '.' + sync.id : sync.type);
}

function addCuesToTrack(cues, track, onEnter, onExit) {
    for (var c = 0; c < cues.length; c++) {
        // create cue
        var cue;
        switch (cues[c].class.name) { // use name to avoid unknown cue class errors
            case 'DataCuePolyfill': // DataCue
                cue = new (cues[c].class)(cues[c].start, cues[c].end, cues[c].content.value, cues[c].content.type);
                break;

            default: // custom cue
                cue = new (cues[c].class)(cues[c].start, cues[c].end, cues[c].content);
                break;
        }

    	// add cue listeners
        if (onEnter) {
            cue.addEventListener('enter', onEnter);
        }
        if (onExit) {
            cue.addEventListener('exit', onExit);
        }

    	// add cue to track
    	track.addCue(cue);
    }
}

function getCueContent(cue) {
    var content = {};
    switch (cue.constructor.name) { // use name to avoid unknown cue class errors
        case 'CountCue':
            content = Number(cue.count);
            break;

        case 'ColourCue':
            content = {background: cue.background, foreground: cue.foreground};
            break;

    	case 'DataCuePolyfill':
            content = {type: cue.type, value: cue.value};
            break;

        default:
            break;
    }
    return content;
}
