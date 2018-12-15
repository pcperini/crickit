#!/usr/bin/env node

import * as app from 'commander'
import * as fs from 'fs'
import * as uuid from 'uuid/v4'
import { Chirp } from './chirp/chirp'
import { size } from './geometry/rectangle'
import { Theme } from './chirp/theme'

const main = async () => {
  app.version('0.0.1')
    .option('-o, --output <path>', 'Output destination')
    .parse(process.argv)
  app.input = app.args[0]

  const inputData = JSON.parse(fs.readFileSync(app.input, 'utf8'))
  await createChirp(inputData, app.output)
}

const createChirp = async (inputData: any, outputPath: string) => {
  const chirp = new Chirp(uuid(),
    inputData.audio.duration,
    inputData.aspect_ratio,
    inputData.theme_name,
    inputData.background,
    inputData.audio,
    inputData.captions
  )

  await chirp.save()
  fs.copyFileSync(chirp.localSource, outputPath)
}

main()
export { createChirp }
// brew install ffmpeg --with-fontconfig --with-libass --with-srt
