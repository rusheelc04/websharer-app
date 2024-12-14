import fetch from 'node-fetch'

import { parse } from 'node-html-parser'

import { escapeHtml } from './escapeHtml.js'

async function getURLPreview(url) {
    try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Error when fetching url: ' + response.status + ' ' + response.statusText)
        }

        const html = await response.text()

        let root
    
        try {
          root = parse(html)
        } catch (parseError) {
          throw new Error('Error parsing HTML content: ' + parseError)
        }

        const metaTags = root.querySelectorAll('meta')

        let ogTitle = null
        let ogImage = null
        let ogUrl = null
        let ogDescription = null
        let ogSiteName = null

        metaTags.forEach((tag) => {
          if (tag.getAttribute('property') === 'og:title') {
              ogTitle = escapeHtml(tag.getAttribute('content'))
          } else if (tag.getAttribute('property') === 'og:image') {
              ogImage = escapeHtml(tag.getAttribute('content'))
          } else if (tag.getAttribute('property') === 'og:url') {
              ogUrl = escapeHtml(tag.getAttribute('content'))
          } else if (tag.getAttribute('property') === 'og:description') {
              ogDescription = escapeHtml(tag.getAttribute('content'))
          } else if (tag.getAttribute('property') === 'og:site_name') {
              ogSiteName = escapeHtml(tag.getAttribute('content'))
          }
        })

        if (!ogUrl) {
          ogUrl = escapeHtml(url)
        }

        if (!ogTitle) {
          const titleTag = root.querySelector('title')
          ogTitle = titleTag ? escapeHtml(titleTag.text) : escapeHtml(url)
        }

        let previewHtml = `
          <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">
            <a href="${ogUrl}" target="_blank">
              <p><strong>${ogTitle}</strong></p>
              ${ogImage ? `<img src="${ogImage}" style="max-height: 200px; max-width: 270px;" alt="Image preview"/>` : ""}
            </a>
            ${ogDescription ? `<p>${ogDescription}</p>` : ""}
            ${ogSiteName ? `<p><em>From: ${ogSiteName}</em></p>` : ""}
          </div>
        `

        return previewHtml

    } catch (err) {
        return `<div>${err}</div>`
    }
}

export default getURLPreview