/*
 * (c) Copyright 2025 Away Team Software (www.awayteam.co.uk)
 */

/* 
 * TextTrackCue class polyfill extended from VTTCue
 * for use with TextTrack.addCue(cue)
 */

(function(root) {
    class TextTrackCuePolyfill extends VTTCue {
        // attributes - none

        // constructor
        constructor(startTime, endTime) {
            // unbounded cue
            if (!isUnboundedTTC && endTime == Infinity) {
                endTime = Number.MAX_VALUE;
            }
            // VTTCue
            super(startTime, endTime, '');
            if (this.constructor == TextTrackCuePolyfill || this.constructor == root.TextTrackCue) {
                throw new TypeError('Abstract base class cannot be instantiated without extension');
            }
        }
        
        // override TextTrackCue properties
//        get endTime() {
//            /*var endTime = this.endTime;
//            if (!isUnboundedTTC) {
//                if (endTime == Number.MAX_VALUE) {
//                    endTime = Infinity;
//                }
//            }*/
//            return this.endTime;
//        }
//        set endTime(endTime) {
//            /*if (endTime == Infinity) {
//                if (!isUnboundedTTC) {
//                    endTime = Number.MAX_VALUE;
//                }
//            }*/
//            this.endTime = endTime;
//        }
        
        // remove VTTCue properties
        get align() {
            return undefined;
        }
        set align(align) {
        }
        
        get line() {
            return undefined;
        }
        set line(line) {
        }
        
        get lineAlign() {
            return undefined;
        }
        set lineAlign(lineAlign) {
        }
        
        get position() {
            return undefined;
        }
        set position(position) {
        }
        
        get positionAlign() {
            return undefined;
        }
        set positionAlign(positionAlign) {
        }
        
        get region() {
            return undefined;
        }
        set region(region) {
        }
        
        get size() {
            return undefined;
        }
        set size(size) {
        }
        
        get snap() {
            return undefined;
        }
        set snap(snap) {
        }
        
        get snapToLines() {
            return undefined;
        }
        set snapToLines(snapToLines) {
        }
        
        get text() {
            return undefined;
        }
        set text(text) {
        }
        
        get vertical() {
            return undefined;
        }
        set vertical(vertical) {
        }
        
        // remove VTTCue methods
        getCueAsHTML() {
            //super.getCueAsHTML();
            return undefined;
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
            super(startTime, endTime);
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