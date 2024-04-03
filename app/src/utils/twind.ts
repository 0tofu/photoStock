import {defineConfig, install, inline} from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import { createMiddleware } from 'hono/factory'

/**
 * Twind configuration.
 */
const twindConfig = defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind(),
  ]
})

/**
 * 描画するhtmlをパースし、Twindのスタイルをインラインで埋め込むミドルウェア.
 */
export const twindInjector = () => {
  install(twindConfig)

  return createMiddleware(async (c, next) => {
    await next()
    if (!c.res.body) {
      return;
    }

    // bodyがReadStreamの為、Bufferに詰め込み文字列に変換する
    const stream = c.res.body
    const chunks: any[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const html = buffer.toString('utf-8')

    // inlineでスタイルを埋め込む.
    c.res = new Response(inline(html), c.res);
  })
}
