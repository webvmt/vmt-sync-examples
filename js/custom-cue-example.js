/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

var count = null;
var colour = null;

function init() {    	
    // load metadata
    const video = document.getElementById('video-player');
    for (const track of video.getElementsByTagName('track')) {
        const vmtFilename = track.getAttribute('src');
        const textTrack = track.track;
        textTrack.mode = 'showing'; // ensure cues are "loaded" - see MDN
        loadVmtFile(vmtFilename, function(vmtSync) {
            var cues = syncToCues(vmtSync, true); // allow custom cues
            addCuesToTrack(cues, textTrack, handleCueEnter, handleCueExit); // add cues with handlers
        });

        //textTrack.addEventListener('cuechange', handleTrackCuesChange);
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
    	case 'CountCue':
            count.innerHTML = content;
            break;
    	
    	case 'ColourCue':
            colour.style['background-color'] = content.background;
            colour.style['color'] = content.foreground;
            break;
    		
    	default:
            break;
    }
}

function handleCueExit(event) {
    const cue = event.target;
    const content = getCueContent(cue);
    const logContent = (typeof content == 'object' ? '{' + toString(content) + '}' : content);
    console.log('cue exit @ ' + cue.endTime.toFixed(SECS_DP) + ' - class: ' + cue.constructor.name + ', content: ' + logContent);

    switch (cue.constructor.name) {
    	case 'CountCue':
            if (count.innerHTML == content) { // exit current state
                count.innerHTML = '';
            }
            break;
    	
    	case 'ColourCue':
            if (colour.style['background-color'] == content.background) { // exit current state
                colour.style['background-color'] = '';
            }
            if (colour.style['color'] == content.foreground) { // exit current state
                colour.style['color'] = '';
            }
            break;
    	
    	default:
            break;
    }
}

function handleTrackCuesChange(event) {
    const cues = event.target;
    console.log('track cues change');
}

window.addEventListener('load', init);
