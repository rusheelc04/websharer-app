import express from 'express'

var router = express.Router()

import getURLPreview from '../utils/urlPreviews.js'

router.get('/preview', async (req, res) => {
    try {
      const urlToPreview = req.query.url

      const previewHtml = await getURLPreview(urlToPreview)

      res.send(previewHtml)

    } catch (err) {
      console.log(err)
      res.status(500).json({"status": "error", "error": err})
    }
})

export default router