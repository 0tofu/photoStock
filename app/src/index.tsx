import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { glob } from 'glob'
import { FC } from 'hono/jsx'
import { twindInjector } from '@/utils/twind'
import { renderer } from '@/utils/renderer'

const PhotoList: FC<{ images: string[] }> = (props: { images: string[] }) => {
  return (
    <ul className="container m-auto gap-4 grid grid-cols-none sm:grid-cols-3 lg:grid-cols-5">
      {props.images.map((image) => {
        const imagePath = image.replace(/^\.\.\//, '/')
        return <li><a href={imagePath}><img src={imagePath}/></a></li>
      })}
    </ul>
  )
}

const app = new Hono()

app.use('/photos/*', serveStatic({
  root: '../photos',
  rewriteRequestPath: (path: string) => path.replace(/^\/photos/, ''),
}))

app.use('*', renderer)
app.use('*', twindInjector())

app.get('/', async (c) => {
  const images = await glob('../photos/**/*.{jpg,jpeg}')
  return c.render(<PhotoList images={images} />)
})

export default app
