import * as ffmpeg from 'fluent-ffmpeg'
import { Layer, Playable, loadFromSource } from './layer'
import { Theme } from '../theme'
import * as path from 'path'
import * as fs from 'fs'
import * as moment from 'moment'
import * as subsrt from 'subsrt'

interface Captions {
  themeName: string
  captions: Caption[]
}

class Subtitle {
  start: number
  end: number
  text: string
}

class Caption {
  text: string
  start?: string
  end: string
}

class CaptionLayer implements Captions, Layer {
  themeName: string
  theme: Theme
  captions: Caption[]
  readonly localSource: string

  constructor(id: string, theme: Theme, captions: Caption[]) {
    this.captions = captions
    this.theme = theme
    this.localSource = `/tmp/ffmpeg/${id}.srt`
  }

  async setup() {
    const subtitles: Subtitle[] = this.captions.map((c, i) => {
      const last = (i > 0 ?
        this.captions[i - 1] :
        { end: '00:00' })

      const start = (c.start ?
        moment.duration(`00:${c.start}`).asSeconds() * 1000 :
        moment.duration(`00:${last.end}`).asSeconds() * 1000)

      const end = (
        start +
        moment.duration(`00:${c.end}`).asSeconds() * 1000
      )

      return {
        text: c.text,
        start: start,
        end: end
      }
    })

    return new Promise<void>((resolve, reject) => {
      const subtitleContents = subsrt.build(subtitles, { format: 'srt' })
      fs.writeFile(this.localSource, subtitleContents, (err) => {
        if (err) { reject(err) }
        else { resolve() }
      })
    })
  }

  addTo(project: ffmpeg): ffmpeg {
    if (this.captions.length === 0) { return project }
    return project.videoFilter({
      filter: 'subtitles',
      options: {
        f: this.localSource,
        force_style: this.theme.ssaStyleString,
        fontsdir: './assets/fonts'
      }
    })
  }
}

export { Captions, CaptionLayer, Caption }
