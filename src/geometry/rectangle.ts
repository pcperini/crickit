class point {
  x: number
  y: number

  get coord(): { x: number, y: number } {
    return { x: this.x, y: this.y }
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  static fromString(pointString: string): point {
    const pt = pointString.split(',').map((i) => parseInt(i, 10))
    return new point(pt[0], pt[1])
  }
}

class size {
  w: number
  h: number

  get dim(): { w: number, h: number } {
    return { w: this.w, h: this.h }
  }

  constructor(w: number = 0, h: number = 0) {
    this.w = w
    this.h = h
  }

  static fromString(sizeString: string): size {
    const sz = sizeString.split(/[,:]/).map((i) => parseInt(i, 10))
    return new size(sz[0], sz[1])
  }

  static fromObj(sizeObj: any): size {
    const sz = new size()
    sz.w = sizeObj.w || sizeObj.width
    sz.h = sizeObj.h || sizeObj.height
    return sz
  }

  sizesThatFit(aspectRatio: size): { paddedSize: size, endSize: size } {
    var endSize: size
    var paddedSize: size
    const rnd = Math.ceil

    if (aspectRatio.w < aspectRatio.h) {
      paddedSize = new size(rnd((this.h * aspectRatio.w) / aspectRatio.h),
        this.h)
      endSize = new size(this.w,
        rnd((this.w * aspectRatio.h) / aspectRatio.w))
    } else if (aspectRatio.w > aspectRatio.h) {
      paddedSize = new size(this.w,
        rnd((this.w * aspectRatio.h) / aspectRatio.w))
      endSize = new size(rnd((this.h * aspectRatio.w) / aspectRatio.h),
        this.h)
    } else { // (aspectRatio.w === aspectRatio.h)
      paddedSize = new size(Math.max(this.w, this.h), Math.max(this.w, this.h))
      endSize = new size(Math.min(this.w, this.h), Math.min(this.w, this.h))
    }

    paddedSize.w += 1
    paddedSize.h += 1

    return { paddedSize, endSize }
  }

  scalingFactor(max: number, step: number = 1.0): number {
    return Math.floor(Math.min(10, max / Math.max(this.w, this.h)))
  }
}

class rectangle {
  origin: point
  size: size

  get x(): number { return this.origin.x }
  get y(): number { return this.origin.y }
  get w(): number { return this.size.w }
  get h(): number { return this.size.h }
  get box(): { x: number, y: number, w: number, h: number } {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.origin = new point(x, y)
    this.size = new size(w, h)
  }

  static fromString(boxString: string): rectangle {
    const box = boxString.split(':')
    const r = new rectangle()
    r.origin = point.fromString(box[0])
    r.size = size.fromString(box[1])
    return r
  }
}

export { point, size, rectangle }
