import express from 'express'

var router = express.Router()

router.get('/', async (req, res) => {
    try {
        const postID = req.query.postID

        if (!postID) {
            return res.status(400).json({ status: "error", error: "postID query parameter is required" })
        }

        const comments = await req.models.Comment.find({ post: postID })
        res.json(comments)
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", err: err.message })
    }
})

router.post('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const { postID, newComment } = req.body

        if (!postID || !newComment) {
            return res.status(400).json({ status: "error", error: "postID and newComment fields are required" })
        }

        const comment = new req.models.Comment({
            username: req.session.account.username,
            comment: newComment,
            post: postID,
            created_date: new Date()
        })

        await comment.save()
        res.json({ status: "success" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", err: err.message })
    }
})

export default router