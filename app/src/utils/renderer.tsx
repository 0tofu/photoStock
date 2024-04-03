import { jsxRenderer } from 'hono/jsx-renderer'

/**
 * 各画面で共通して利用するレンダラー.
 */
export const renderer = jsxRenderer(
  ({ children }) => {
    return (
      <html>
        <head>
          <title>photoStock</title>
        </head>
      <body className="bg-white dark:bg-black">{children}</body>
      </html>
    )
  },
  {
    docType: true
  }
)
