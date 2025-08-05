/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

var count = null;
var count2 = null;

function init() {    	
    // load metadata
    const video = document.getElementById('video-player');
    for (const track of video.getElementsByTagName('track')) {
        const vmtFilename = track.getAttribute('src');
        const textTrack = track.track;
        textTrack.mode = 'showing'; // ensure cues are "loaded" - see MDN
        loadVmtFile(vmtFilename, function(vmtSync) {
            var cues = syncToCues(vmtSync, false); // prohibit custom cues
            addCuesToTrack(cues, textTrack, handleCueEnter, handleCueExit); // add cues with handlers
        });

        //textTrack.addEventListener('cuechange', handleTrackCuesChange);
    }
    
    // connect display
    count = document.getElementById('count');
    count2 = document.getElementById('count-2');
}

function handleCueEnter(event) {
    const cue = event.target;
    const content = getCueContent(cue);
    const logContent = (typeof content == 'object' ? '{' + toString(content) + '}' : content);
    console.log('cue enter @ ' + cue.startTime.toFixed(SECS_DP) + ' - class: ' + cue.constructor.name + ', content: ' + logContent);

    switch (cue.constructor.name) {
    	case 'DataCuePolyfill':
            switch (content.type) {
                case 'org.webvmt.example.count.down':
                    count.innerHTML = content.value;
                    break;
        
                case 'org.webvmt.example.count.up':
                    count2.innerHTML = content.value;
                    break;
                
                default:
                    break;
            }
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
        case 'DataCuePolyfill':
            switch (content.type) {
                case 'org.webvmt.example.count.down':
                    if (count.innerHTML == content.value) { // exit current state
                        count.innerHTML = '';
                    }
                    break;

                case 'org.webvmt.example.count.up':
                    if (count2.innerHTML == content.value) { // exit current state
                        count2.innerHTML = '';
                    }
                    break;
                    
                default:
                    break;
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
