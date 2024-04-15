import * as buffer from "node:buffer"
import * as path from "node:path"
import { renderer } from "@/utils/renderer"
import { twindInjector } from "@/utils/twind"
import { glob } from "glob"
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import type { FC } from "hono/jsx"

const PhotoList: FC<{ images: string[] }> = (props: { images: string[] }) => {
  return (
    <ul className="container m-auto grid grid-cols-none gap-4 lg:grid-cols-5 sm:grid-cols-3">
      {props.images.map((image) => {
        const imagePath = image.replace(/^\.\.\//, "/")
        return (
          <li>
            <a href={imagePath}>
              <img src={imagePath} alt={path.basename(imagePath)} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

const app = new Hono()

app.use(
  "/photos/*",
  serveStatic({
    root: "../photos",
    rewriteRequestPath: (path: string) => path.replace(/^\/photos/, ""),
    mimes: {
      JPG: "image/jpeg",
    },
  }),
)

app.use("*", renderer)
app.use("*", twindInjector())

app.get("/", async (c) => {
  const images = await glob("../photos/**/*.{jpg,jpeg}", { nocase: true })
  return c.render(<PhotoList images={images} />)
})

export default app
