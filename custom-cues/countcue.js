/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

/*
 * CountCue class extended from TextTrackCuePolyfill
 */ 

class CountCue extends TextTrackCuePolyfill {
    // attributes
    #secs;

    // constructor
    constructor(startTime, endTime, content) {
        // TextTrackCuePolyfill
        super(startTime, endTime);
        // CountCue
        this.#setSecs(content);
    }

    #setSecs(value) {
        if (typeof value == 'number') {
            this.#secs = value;
        }
    }
    
    // secs
    get secs() {
        return this.#secs;
    }
    set secs(secs) {
        this.#setSecs(secs);
    }  
}
