# crickit

## Command Line

Install: `npm install -g crickit`

Usage: `crickit [options]`

Options:
-  `-V`, `--version`                   output the version number
-  `-a`, `--audioSource` `<path>`        Path to audio
-  `-s`, `--audioStart` `<hh:mm:ss.ss>`  Timestamp to start audio (default: "00:00:00.00")
-  `-p`, `--pictureSource` `<path>`      Path to picture
-  `-d`, `--duration` `<mm:ss.ss>`       Output duration
-  `-o`, `--output` `<path> `            Output destination
-  `-c`, `--captionSource` `<path>`      Path to captions JSON file
-  `--aspectRatio` `<ratio>`           Output aspect ratio (default: "1:1")
-  `--theme` `<name>`                  Theme name. One of: white_whale,crane,blurb,engagement,whisper,poppins,coarse_grind,froyo,obscura (default: "obscura")
-  `-h`, `--help`                      output usage information

## JavaScript

Install: `npm install --save crickit`

Usage:
```
const chirp = new Chirp("some-unique-id",
  "00:14.00",
  "1:1",
  "obscura",
  { source: "/usr/files/background.png", duration: "00:14.00" },
  { source: "/usr/files/ep.mp3", start: "00:23:05.10", duration: "00:14.00" },
  [{ text: "Lorem ispum", start: "00:00.00", end: "00:14.00" }]
)
```
