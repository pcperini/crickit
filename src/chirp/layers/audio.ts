import * as ffmpeg from 'fluent-ffmpeg'
import { Layer, Playable, loadFromSource } from './layer'
import * as path from 'path'
import * as moment from 'moment'

interface Audio extends Playable {
  start: string
}

class AudioLayer implements Audio, Layer {
  source: string
  start: string
  duration: string
  fade: { in?: number, out?: number }

  readonly localSource: string

  private get durationSeconds(): number {
    return moment.duration(`00:${this.duration}`).asSeconds()
  }

  private fadeDurationSeconds(direction: 'in' | 'out'): number {
    return moment.duration(`00:${this.fade[direction]}`).asSeconds()
  }

  constructor(id: string,
    source: string,
    start: string,
    duration: string,
    fade: { in?: number, out?: number} = {}) {
      this.source = source
      this.localSource = `/tmp/ffmpeg/${id}${path.extname(source)}`

      this.start = start
      this.duration = duration
      this.fade = fade
    }

  async setup() {
    await loadFromSource(this.source, this.localSource)
  }

  addTo(project: ffmpeg): ffmpeg {
    project = project.input(this.localSource)
      .seekInput(this.start)
      .duration(this.duration)

    const duration = this.durationSeconds
    return Object.keys(this.fade).reduce((proj, dir: 'in' | 'out') => {
      const fadeDuration = this.fadeDurationSeconds(dir)
      return project.audioFilter({
        filter: 'afade',
        options: {
          t: dir,
          st: duration - ({ in: duration, out: fadeDuration }[dir]),
          d: fadeDuration
        }
      })
    }, project)
  }
}

export { Audio, AudioLayer }
