import { rectangle, size } from '../../geometry/rectangle'
import { Layer, Playable, loadFromSource } from './layer'
import * as ffmpeg from 'fluent-ffmpeg'
import * as path from 'path'
import * as imageSize from 'image-size'
import * as moment from 'moment'

interface Visual extends Playable {
  crop?: rectangle
}

class VisualLayer implements Visual, Layer {
  source: string
  duration: string
  crop?: rectangle
  readonly localSource: string

  private aspectRatio: size
  private fps: number = 60

  private paddedSize: size
  private endSize: size

  private scalingFactor: number
  private scalingRatio: number
  private finalScale: number

  private panDelta: size
  private panDuration: number

  private get durationSeconds(): number {
    return moment.duration(`00:${this.duration}`).asSeconds()
  }

  constructor(id: string,
    source: string,
    aspectRatio: size,
    duration: string,
    crop?: rectangle) {
      this.source = source
      this.localSource = `/tmp/ffmpeg/${id}${path.extname(source)}`

      this.aspectRatio = aspectRatio
      this.duration = duration
      this.crop = crop
    }

  async setup() {
    await loadFromSource(this.source, this.localSource)
    const rawSize = size.fromObj(imageSize(this.localSource))

    this.crop = (
      this.crop ||
      new rectangle(0, 0, rawSize.w, rawSize.h)
    )

    const startSize = this.crop.size
    const { paddedSize, endSize } = startSize.sizesThatFit(this.aspectRatio)
    this.paddedSize = paddedSize
    this.endSize = endSize

    this.scalingFactor = paddedSize.scalingFactor(15000)
    this.scalingRatio = (
      Math.max(paddedSize.w, paddedSize.h) / Math.min(startSize.w, startSize.h)
    )

    this.panDuration = this.durationSeconds * this.fps
    this.panDelta = new size(
      ((startSize.w - endSize.w) / this.panDuration) * this.scalingFactor,
      ((startSize.h - endSize.h) / this.panDuration) * this.scalingFactor,
    )
  }

  addTo(project: ffmpeg): ffmpeg {
    const filters = [
      { filter: 'crop', options: this.crop.box },
      { filter: 'pad', options: this.paddedSize.dim },
      { filter: 'scale', options: {
        w: `iw*${this.scalingFactor}`,
        h: `ih*${this.scalingFactor}`
      }},
      { filter: 'zoompan', options: {
        z: this.scalingRatio,
        x: `x+${this.panDelta.w}`,
        y: `y+${this.panDelta.h}`,
        s: (
          `${this.endSize.w * this.scalingRatio}x` +
          `${this.endSize.h * this.scalingRatio}`
        ),
        fps: this.fps,
        d: this.panDuration
      }},
      { filter: 'scale', options: {
        w: `${this.endSize.w}+1`,
        h: `${this.endSize.h}+1`
      }},
    ]

    project = project.input(this.localSource)
      .loop(this.durationSeconds)
    return filters.reduce((p, filter) => p.videoFilter(filter), project)
  }
}

export { Visual, VisualLayer }
