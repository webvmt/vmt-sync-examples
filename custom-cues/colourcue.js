/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

/*
 *  ColourCue class extended from TextTrackCuePolyfill
 */

class ColourCue extends TextTrackCuePolyfill {
    // attributes
    #background;
    #foreground;

    // constructor
    constructor(startTime, endTime, content) {
        // TextTrackCuePolyfill
        super(startTime, endTime);
        // ColourCue
        if (typeof content == 'object') {
            this.#background = content.background;
            this.#foreground = content.foreground;
        }
        // to do: use arguments to identify background/foreground parameters
    }

    // background
    get background() {
        return this.#background;
    }
    set background(background) {
        this.#background = background;
    }

    // foreground
    get foreground() {
        return this.#foreground;
    }
    set foreground(foreground) {
        this.#foreground = foreground;
    }
    
}
