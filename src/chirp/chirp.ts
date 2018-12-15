import * as ffmpeg from 'fluent-ffmpeg'
import { Layer } from './layers/layer'
import { Visual, VisualLayer } from './layers/visual'
import { Audio, AudioLayer } from './layers/audio'
import { Caption, Captions, CaptionLayer } from './layers/caption'
import { Theme } from './theme'
import { size } from '../geometry/rectangle'

class Chirp {
  readonly localSource: string

  private project: ffmpeg = ffmpeg()
  private layers: Layer[] = []

  constructor(id: string,
    duration: string,
    aspectRatio: string,
    themeName: string,
    videoInfo: Visual,
    audioInfo: Audio,
    captions: Caption[]) {
      this.localSource = `/tmp/ffmpeg/${id}.mp4`

      this.layers.push(new VisualLayer(id,
        videoInfo.source,
        size.fromString(aspectRatio),
        videoInfo.duration,
        videoInfo.crop))

      this.layers.push(new AudioLayer(id,
        audioInfo.source,
        audioInfo.start,
        audioInfo.duration))

      this.layers.push(new CaptionLayer(id,
        Theme.sampleThemes[themeName],
        captions))
    }

    async save(): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        await Promise.all(this.layers.map((l) => l.setup()))
        const project = this.layers.reduce((proj, l) => l.addTo(proj),
          this.project)
          .videoBitrate(20000)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            '-pix_fmt yuv420p',
            '-profile:v baseline',
            '-level 3'
          ])

        project.on('error', (err) => { console.log(err); reject(err) })
          .on('end', () => resolve(this.localSource))
          .save(this.localSource)
      })
    }
}

export { Chirp }
