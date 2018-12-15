// import 'mocha'
// import { expect } from 'chai'
// import * as fs from 'fs'
// import * as uuid from 'uuid/v4'
//
// import { size } from '../src/geometry/rectangle'
// import { AudioLayer } from '../src/chirp/layers/audio'
// import { VisualLayer } from '../src/chirp/layers/visual'
// import { CaptionLayer } from '../src/chirp/layers/caption'
// import { Theme } from '../src/chirp/theme'
//
// describe('Audio', () => {
//   const testData = {
//     source: "https://cast.rocks/hosting/9090/Episode-0---Comfort-and-Coca-Cola.mp3",
//     start: "00:04:18.00",
//     duration: "00:35.00"
//   }
//
//   it('should create audio layer and save to local source', async function() {
//     this.timeout(100000)
//     const audioLayer = new AudioLayer(uuid(),
//       testData.source,
//       testData.start,
//       testData.duration)
//     await audioLayer.setup()
//     expect(fs.existsSync(audioLayer.localSource)).to.eq(true)
//   })
// })
//
// describe('Visual', () => {
//   const testData = {
//     source: "https://uploads-ssl.webflow.com/5aef32716154a8e1aab2cd96/5aef3b826154a82c2cb2d46e_WJD_9248.jpg",
//     aspect_ratio: "1:1",
//     duration: "00:35.00"
//   }
//
//   it('should create visual layer and save to local source', async function() {
//     this.timeout(100000)
//     const visualLayer = new VisualLayer(uuid(),
//       testData.source,
//       size.fromString(testData.aspect_ratio),
//       testData.duration)
//     await visualLayer.setup()
//     expect(fs.existsSync(visualLayer.localSource)).to.eq(true)
//   })
// })
//
// describe('Caption', () => {
//   const testData = {
//     theme: 'coarse_grind',
//     captions: [{
//       "text": "When I was young young,",
//       "start": "00:07.00",
//       "duration": "00:02.01"
//     }]
//   }
//
//   it('should create caption layer and save to local source', async function() {
//     this.timeout(100000)
//     const captionLayer = new CaptionLayer(uuid(),
//       Theme.sampleThemes[testData.theme],
//       testData.captions)
//     await captionLayer.setup()
//     expect(fs.existsSync(captionLayer.localSource)).to.eq(true)
//   })
// })
