/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

var count = null;
var colour = null;
var options;
var previousLatestTime = -Infinity;

function init() {
    // set example options
    const defaults = {cueEvent: true};
    options = setExampleOptions(defaults); // in common-example.js
    // load metadata
    const video = document.getElementById('video-player');
    for (const track of video.getElementsByTagName('track')) {
        const vmtFilename = track.getAttribute('src');
        const textTrack = track.track;
        textTrack.mode = 'showing'; // ensure cues are "loaded" - see MDN
        loadVmtFile(vmtFilename, function(vmtSync) {
            var cues = syncToCues(vmtSync, false); // prohibit custom cues
            const handleEnter = (options.cueEvent ? handleCueEnter : undefined);
            const handleExit = (options.cueEvent ? handleCueExit : undefined);
            addCuesToTrack(cues, textTrack, handleEnter, handleExit); // add cues with handlers
        });

        const handleCuesChange = (!options.cueEvent ? handleTrackCuesChange : undefined);
        textTrack.addEventListener('cuechange', handleCuesChange);
    }
    
    // connect display
    count = document.getElementById('count');
    colour = document.getElementById('colour');
}

function handleCueEnter(event) {
    const cue = event.target;
    const content = getCueContent(cue);
    const logContent = (typeof content == 'object' ? '{' + toString(content) + '}' : content);
    console.log('cue enter @ ' + cue.startTime.toFixed(SECS_DP) + ' - class: ' + cue.constructor.name + ', content: ' + logContent);

    switch (cue.constructor.name) {
    	case 'DataCuePolyfill':
            switch (content.type) {
                case 'org.webvmt.example.count':
                    showCountActive(content.value);
                    break;
        
                case 'org.webvmt.example.colour':
                    showColourActive(content.value);
                    break;
                
                default:
                    break;
            }
            break;
    		
    	default:
            break;
    }
    previousLatestTime = -Infinity; // reset
}

function handleCueExit(event) {
    const cue = event.target;
    const content = getCueContent(cue);
    const logContent = (typeof content == 'object' ? '{' + toString(content) + '}' : content);
    console.log('cue exit @ ' + cue.endTime.toFixed(SECS_DP) + ' - class: ' + cue.constructor.name + ', content: ' + logContent);

    switch (cue.constructor.name) {
        case 'DataCuePolyfill':
            switch (content.type) {
                case 'org.webvmt.example.count':
                    if (count.innerHTML == content.value) { // exit current state
                        showCountInactive();
                    }
                    break;

                case 'org.webvmt.example.colour':
                    if ((colour.style['background-color'] == content.value.background) && (colour.style['color'] == content.value.foreground)) { // exit current state
                        showColourInactive();
                    }
                    break;
                    
                default:
                    break;
            }
            break;
    	
    	default:
            break;
    }
    
    // unbounded cues only exit on rewind, so update display using active list
    if (cue.endTime == Infinity || cue.endTime == Number.MAX_VALUE) { // unbounded
        // rewind - check active cues
        const textTrack = cue.track; 
        if (textTrack) { // associated track
            const latestTime = getLatestStartTime(textTrack.activeCues);
            if (latestTime != previousLatestTime) { // avoid repetition
                showCues(textTrack.activeCues);
                previousLatestTime = latestTime;
            }
        }
    }
}

function showCountActive(value) {
    count.innerHTML = value;
}

function showCountInactive() {
    count.innerHTML = '';
}

function showColourActive(value) {
    colour.style['background-color'] = value.background;
    colour.style['color'] = value.foreground;
}

function showColourInactive() {
    colour.style['background-color'] = '';
    colour.style['color'] = '';
}

function handleTrackCuesChange(event) {
    const textTrack = event.target;
    const id = (textTrack.id ? textTrack.id : '');
    console.log('cues change on track ' + id);
    
    // inactive by default
    switch (id) {
        case 'count-track': // count cues
            showCountInactive();
            break;
        case 'colour-track': // colour cues
            showColourInactive();
            break;
        default: // mixed cues
            showCountInactive();
            showColourInactive();
            break;
    }
    
    // active cues
    showCues(textTrack.activeCues);
}

function showCues(cueList) {
    for (const cue of cueList) {
        const content = getCueContent(cue);
        const logContent = (typeof content == 'object' ? '{' + toString(content) + '}' : content);
        console.log('cue active @ ' + cue.startTime.toFixed(SECS_DP) + ' - class: ' + cue.constructor.name + ', content: ' + logContent);

        switch (cue.constructor.name) {
            case 'DataCuePolyfill':
                switch (content.type) {
                    case 'org.webvmt.example.count':
                        showCountActive(content.value);
                        break;

                    case 'org.webvmt.example.colour':
                        showColourActive(content.value);
                        break;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }
}

window.addEventListener('load', init);
