# vmt-sync-examples

## Overview

These examples show how timed metadata can be synchronised with video using the [WebVMT sync command](https://www.w3.org/TR/webvmt/#synchronized-data) and accessed with [DataCue](https://wicg.github.io/datacue/#datacue-interface) or a custom [TextTrackCue](https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue) in a web page

![DataCue example web page with console log]("images/DataCue_ConsoleFirefox.jpg")  
_DataCue example web page with console log_

### Data types

Example code focuses on a video synchronised with two disparate types of timed metadata:

 * `count` cues which contain a single number
 * `colour` cues which contain a structured object with `foreground` and `background` attributes

### Code design

The basic design to access timed metadata in a web page using WebVMT is:

 1. Read synchronised data cues from a VMT file.
 1. Create a `DataCue` or custom `TextTrackCue` for each cue.
 1. Attach `enter` and `exit` handlers to each cue.
 1. Add all these cues to `TextTrack` to synchronise them with a video.
 1. Process timed data using event handlers.

 ````mermaid
 graph TD;
   A(VMT file) --> |Parse| B;
   B("WebVMT sync
   commands") --> |Create| C;
   C(DataCues) --> |"Add event
   handlers"| E;
   B --> |Create| D(Custom cues);
   D --> |"Add event
   handlers"| E;
   E("Cues with
   handlers") --> |Add| F;
   F(TextTrack) --> |Cue events| G;
   G(Data consumer);
 ````

In this example, `count` and `colour` cues are delivered by a single track using `DataCue`.

* [DataCue example](datacue.html)

### Code variations

Each variation is based on the basic design above, but demonstrates how a single additional feature can be integrated with this design. Many variations produce the same net result as the basic design, though underlying differences can be observed in the `console.log` output.

Code variations are:

 1. [Streaming cues](#streaming) for live streaming
 1. [Custom cues](#custom-cues) for tailored access
 1. [Duplicate data types](#duplicate-types) to distinguish similar data streams
 1. [Multiple tracks](#multiple-tracks) to merge data streams

#### <a id='streaming'></a>Streaming cues

Live streaming use cases can include cues with a known start time and content, but an _unknown_ end time - which may become known in the future. These [unbounded cues](https://html.spec.whatwg.org/multipage/media.html#unbounded-text-track-cue) can be represented in a VMT file by omitting the cue end time.

Unbounded cues can be overridden by a later cue of the same type as shown in the [streaming.vmt](vmt/streaming.vmt) file. This file produces the same net result as the bounded cues in [mixed.vmt](vmt/mixed.vmt), but without referring to any _future_ time.

In this example, bounded cues are replaced with unbounded cues, so no cue refers to a future time.

* [Streaming example](streaming.html)

#### <a id='custom-cues'></a>Custom cues

Custom cues can be used to define cue content and functions with which to access content for a particular use case. For example, a geographical location cue may include functions to return speed and distance travelled.

All cues must be derived from `TextTrackCue` in order to integrate with `TextTrack`. `DataCue` and `VTTCue` are examples of cues for timed data and timed text respectively. [Users may define their own custom cues](https://html.spec.whatwg.org/multipage/media.html#guidelines-for-exposing-cues-in-various-formats-as-text-track-cues) derived from either of these classes, or directly from `TextTrackCue` using a [polyfill](polyfills).


In this example, `count` and `colour` cues are delivered using custom `CountCue` and `ColourCue` classes instead of `DataCue`. Custom cue definitions can be found in the [custom-cues](custom-cues) directory.

* [Custom cue example](custom-cue.html)

#### <a id='duplicate-types'></a>Duplicate data types

Multiple data streams of a similar type may need to be distinguished. For example, a theatre or music venue may include several stage lights of the same type which need to be controlled independently of each other for a live screening event.

Cue types should contain sufficient detail to allow proper identification and interpretation of timed metadata. The following example displays two discrete counts which are identified and handled correctly.

In this example, `colour` cues are replaced by a second `count` stream which does not interfere with the first.

* [Multiple count example](multi-count.html)

#### <a id='multiple-tracks'></a>Multiple tracks

Data from multiple VMT files can be merged into a single VMT file without any penalty, though there may be reasons why this is impractical. For example, data from discrete sources may need to be retained in their original form to preserve integrity as admissible evidence.

In this example, `colour` and `count` cues are read from two discrete VMT files by two discrete tracks which are both synchronised with the same video.

* [Multiple track example](multi-track.html)
