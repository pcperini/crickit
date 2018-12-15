#!/usr/bin/env node

import * as app from "commander"
import { Chirp } from './chirp/chirp'
import { size } from './geometry/rectangle'
import { Theme } from './chirp/theme'

const main = async () => {
  app.version('0.0.1')
    // .option('-p, --peppers', 'Add peppers')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq-sauce', 'Add bbq sauce')
    // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv)

  // const chirp = new Chirp('UUID',
  //   20, new size(1, 1),
  //   { source: '/Users/pcperini/Downloads/skeleton.jpg', duration: '00:20' },
  //   { source: '/Users/pcperini/Documents/Projects/Art/Coarse\ Ground/Episode\ 5/cuts/Story\ -\ 12\:5\:18\,\ 1.55\ PM.mp3', duration: '00:20', start: '00:00' })
  // await chirp.save()
}

main()

// brew install ffmpeg --with-fontconfig --with-libass --with-srt
