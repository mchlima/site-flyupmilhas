export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    // Find font URLs in the rendered HTML and add preload links
    const fontRegex = /\/_fonts\/[^"')\s]+\.woff2/g
    const fonts = new Set<string>()

    for (const part of html.head) {
      const matches = part.match(fontRegex)
      if (matches) matches.forEach(f => fonts.add(f))
    }
    for (const part of html.bodyAppend) {
      const matches = part.match(fontRegex)
      if (matches) matches.forEach(f => fonts.add(f))
    }

    const preloads = [...fonts].map(
      f => `<link rel="preload" as="font" type="font/woff2" href="${f}" crossorigin>`,
    )

    if (preloads.length) {
      html.head.unshift(preloads.join('\n'))
    }
  })
})
