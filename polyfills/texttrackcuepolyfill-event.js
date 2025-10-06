/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

/* 
 * TextTrackCue class polyfill extended from EventTarget
 * for use with cue.dispatchEvent(event)
 */

(function(root) {
    class TextTrackCuePolyfill extends EventTarget {
        // attributes
        track;
        pauseOnExit;
        id;
        startTime;
        endTime;
        onenter;
        onexit;

        // constructor
        constructor(startTime, endTime) {
            // EventTarget
            super();
            if (this.constructor == TextTrackCuePolyfill || this.constructor == root.TextTrackCue) {
                throw new TypeError('Abstract base class cannot be instantiated without extension');
            }
            // TextTrackCue
            this.startTime = startTime;
            this.endTime = endTime;
            this.track = null;
            this.pauseOnExit = false;
            this.id = '';
            this.onenter = null;
            this.onexit = null;
        }
    }

    class DataCuePolyfill extends TextTrackCuePolyfill {
        // attributes
        value;
        type;

        // constructor
        constructor(startTime, endTime, value, type) {
            // TextTrackCue
            super(startTime, endTime);
            // DataCue
            this.value = value;
            this.type = type;
        }
        
        // value
        get value() {
            return this.value;
        }
        set value(value) {
            this.value = value;
        }

        // type
        get type() {
            return this.type;
        }
        set type(type) {
            this.type = type;
        }
    }

    /*
     * Attach polyfill
     */ 
    
    // native TextTrackCue check
    class TestCue extends root.TextTrackCue {
        constructor(startTime, endTime) {
            super(startTime, endTime, ''); // default id=''
        }
    }
    var isNativeTTC = false;
    try {
        const ttc = new TestCue(0, 1);
        isNativeTTC = true; // success
    } catch (error) {
        console.log('TextTrackCue polyfill: ' + error);
    }
    //isNativeTTC = true; // for testing only
    root.TextTrackCuePolyfill = (isNativeTTC ? root.TextTrackCue : TextTrackCuePolyfill);
    root.DataCuePolyfill = DataCuePolyfill;
    
    // unbounded cue check
    var isUnboundedTTC = false;
    try {
        const unbounded = new TestCue(0, Infinity);
        isUnboundedTTC = true;
    } catch (error) {
        console.log('Unbounded cue polyfill: ' + error);
    }
})(this);