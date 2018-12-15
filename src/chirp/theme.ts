interface StyleType {
  readonly styleValue: string | number
}

enum TextAlignment {
  BottomLeft = 1,
  BottomCenter,
  BottomRight,
  TopLeft,
  TopCenter,
  TopRight,
  CenterLeft,
  Center,
  CenterRight
}

function textAlignmentFromString(value: string): TextAlignment {
  return TextAlignment[value]
}

function toCamelCase(value: string): string {
  return value
    .replace(/\s(.)/g, (i) => i.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (i) => i.toUpperCase())
}

enum BorderStyle {
  Outline = 1,
  Box = 3
}

class Color implements StyleType {
  private value: string = '#000000'

  get styleValue(): string {
    var styleValue = this.value
    if (styleValue.length == 7) { styleValue = `&H00${styleValue.substr(1,6)}` }
    else if (styleValue.length == 9) {
      const alpha: number = 255 - parseInt(`0x${styleValue.substr(7, 2)}`)
      styleValue = (
        `&H${alpha.toString(16).toUpperCase()}` +
        `${styleValue.substr(1,6)}`
      )
    }
    return styleValue
  }

  constructor(value: string) {
    if (value.startsWith('#')) {
      this.value = value
    }
  }
}

class Theme {
  private static sampleThemesSource = require('../../assets/themes.json')
  static readonly sampleThemes = Object.keys(Theme.sampleThemesSource)
    .reduce((all, next) => ({
      [next]: Theme.fromObj(Theme.sampleThemesSource[next]),
      ...all
    }), {})

  fontName: string
  alignment: TextAlignment
  primaryColor: Color
  outlineColor: Color
  fontSize: 24
  videoFilters: any[]

  get styles(): any {
    const skipStyles = ['VideoFilters']
    const validStyles = [
      'Name', 'Encoding',
      'FontName', 'FontSize',
      'PrimaryColour', 'SecondaryColour', 'OutlineColour',
      'BackColour',
      'Bold', 'Italic', 'Underline', 'StrikeOut',
      'ScaleX', 'ScaleY', 'Spacing', 'Angle',
      'BorderStyle', 'Outline', 'Shadow',
      'Alignment', 'MarginL', 'MarginR', 'MarginV'
    ]

    return Object.getOwnPropertyNames(this).reduce((all, style) => {
      const styleName = toCamelCase(style)
        .replace(/([cC]olor)/g, 'Colour')

      if (validStyles.indexOf(styleName) === -1) {
        if (skipStyles.indexOf(styleName) === -1) {
          console.warn(`Invalid style name: ${style}`);
        }

        return all
      }

      const rawStyleValue = this[style]
      var styleValue: string | number

      if (rawStyleValue['styleValue'] !== undefined) {
        styleValue = (<StyleType>rawStyleValue).styleValue
      } else {
        styleValue = <number | string>rawStyleValue
      }

      return {
        [styleName]: styleValue,
        ...all
      }
    }, {})
  }

  get ssaStyleString(): string {
    const styles = this.styles
    return Object.keys(styles)
      .reduce((all, style) => [`${style}=${styles[style]}`, ...all], [])
      .join(',')
  }

  private static fromObj(obj: any): Theme {
    const theme = new Theme()
    theme.fontName = obj.fontName || 'Open Sans Bold'
    theme.alignment = textAlignmentFromString(obj.alignment || 'BottomCenter')
    theme.primaryColor = new Color(obj.primaryColor || '#FFFFFF')
    theme.outlineColor = new Color(obj.outlineColor || '#000000')
    theme.fontSize = obj.fontSize || 24
    theme.videoFilters = obj.videoFilters || []
    return theme
  }
}

export { Theme, TextAlignment, BorderStyle, Color }
