import * as ffmpeg from 'fluent-ffmpeg'
import * as request from 'request'
import * as fs from 'fs'

interface Layer {
  source?: string
  readonly localSource: string

  setup(): void
  addTo(project: ffmpeg): ffmpeg
}

interface Playable {
  source: string
  duration: string
}

function loadFromSource(source: string, localSource: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (source.startsWith('/')) {
      fs.copyFile(source, localSource, (err) => {
        if (err) { reject(err) }
        else { resolve() }
      });
    } else {
      request(source)
        .on('error', reject)
        .pipe(fs.createWriteStream(localSource))
        .on('finish', resolve)
    }
  })
}

export { Layer, Playable, loadFromSource }
