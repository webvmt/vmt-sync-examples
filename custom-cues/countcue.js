/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

/*
 * CountCue class extended from TextTrackCuePolyfill
 */ 

class CountCue extends TextTrackCuePolyfill {
    // attributes
    #count;

    // constructor
    constructor(startTime, endTime, content) {
        // TextTrackCuePolyfill
        super(startTime, endTime);
        // CountCue
        this.#setCount(content);
    }

    #setCount(value) {
        if (typeof value == 'number') {
            this.#count = value;
        }
    }
    
    // count
    get count() {
        return this.#count;
    }
    set count(value) {
        this.#setCount(value);
    }  
}
