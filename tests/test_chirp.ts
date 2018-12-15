import 'mocha'
import { expect } from 'chai'
import * as fs from 'fs'
import * as uuid from 'uuid/v4'

import { Chirp } from '../src/chirp/chirp'

describe('Chirp', () => {
  const testData = {
    aspect_ratio: "1:1",
    theme_name: "coarse_grind",
    destination: "/Users/pcperini/Desktop/ep1_1.mp4",
    audio: {
      source: "https://cast.rocks/hosting/9090/Episode-0---Comfort-and-Coca-Cola.mp3",
      start: "00:04:18.00",
      duration: "00:05.00"
    },
    background: {
      source: "https://uploads-ssl.webflow.com/5aef32716154a8e1aab2cd96/5aef3b826154a82c2cb2d46e_WJD_9248.jpg",
      duration: "00:05.00"
    },
    captions: [{
      text: "When I was young young",
      start: "00:01.00",
      duration: "00:02.01"
    }, {
      text: "When I was young young",
      duration: "00:01.00"
    }]
  }

  it('should create a chirp and save to local source', async function() {
    this.timeout(10000000)
    const chirp = new Chirp(uuid(),
      testData.audio.duration,
      testData.aspect_ratio,
      testData.theme_name,
      testData.background,
      testData.audio,
      testData.captions)
    await chirp.save()
    expect(fs.existsSync(chirp.localSource)).to.eq(true)
  })
})
