#!/usr/bin/env node

import * as app from 'commander'
import * as fs from 'fs'
import * as uuid from 'uuid/v4'
import { Chirp } from './chirp/chirp'
import { Theme, TextAlignment, Color } from './chirp/theme'

function validate<T>(value: T,
  error: string,
  test: (T) => boolean = () => (!!value)): T {
    if (test(value)) { return value }
    console.error(error)
    process.exit(1)
}

const main = async () => {
  app.version('1.0.4')
    .option('-a, --audioSource <path>', 'Path to audio')
    .option('-s, --audioStart <hh:mm:ss.ss>',
      'Timestamp to start audio',
      '00:00:00.00')
    .option('-p, --pictureSource <path>', 'Path to picture')
    .option('-d, --duration <mm:ss.ss>', 'Output duration')
    .option('-o, --output <path>', 'Output destination')
    .option('-c, --captionSource <path>', 'Path to captions JSON file')
    .option('--aspectRatio <ratio>', 'Output aspect ratio', '1:1')
    .option('--theme <name>',
      `Theme name. One of: ${Object.keys(Theme.sampleThemes)}`)
    .option('-t', 'Use a custom theme. Requires --theme[Property] options')
    .option('--themeFontName <name>', 'Name of font family')
    .option('--themeFont <path>', 'Path to font file')
    .option('--themeFontSize <size>', 'Font size', parseInt)
    .option('--themeAlignment <alignment>',
      `Alignment. One of: ${Object.keys(TextAlignment)}`,
      (a) => TextAlignment.fromString)
    .option('--themePrimaryColor <#RRGGBB>',
      'Text color',
      (c) => (new Color(c)))
    .option('--themeOutlineColor <#RRGGBB>',
      'Outline color',
      (c) => (new Color(c)))
    .parse(process.argv)

  const duration: string = validate(app.duration,
    'Duration must not be null')
  const audioSource: string = validate(app.audioSource,
    'Audio Source must not be null')
  const pictureSource: string = validate(app.pictureSource,
    'Picture Source must not be null')
  const outputPath: string = validate(app.output,
    'Output Path must not be null')

  var captions = []
  if (app.captionSource) {
    const captionsContents = fs.readFileSync(app.captionSource, 'utf8')
    captions = JSON.parse(captionsContents)
  }

  // Coerce theme
  var theme: Theme
  if (app.theme && !app.t) {
    theme = Theme.sampleThemes[app.theme]
  } else if (app.t && !app.theme) {
    theme = new Theme()
    theme.fontName = validate(app.themeFontName, 'Font name must not be null')
    theme.fontPath = validate(app.themeFont, 'Font path must not be null')
    theme.alignment = app.themeAlignment
    theme.primaryColor = app.themePrimaryColor
    theme.outlineColor = app.themeOutlineColor
    theme.fontSize = app.themeFontSize
  } else {
    console.error('Cannot use custom theme (-t) with default theme (--theme)')
    process.exit(1)
  }

  const chirp = new Chirp(uuid(),
    app.duration,
    app.aspectRatio,
    theme,
    { source: pictureSource, duration: app.duration },
    { source: audioSource, start: app.audioStart, duration: app.duration },
    captions
  )

  await chirp.save()
  fs.copyFileSync(chirp.localSource, app.output)
}

main()

// brew install ffmpeg --with-fontconfig --with-libass --with-srt
