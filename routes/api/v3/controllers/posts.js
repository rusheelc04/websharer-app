import express from 'express'

var router = express.Router()

import getURLPreview from '../utils/urlPreviews.js'

import { escapeHtml } from '../utils/escapeHtml.js'

router.post('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const newPost = new req.models.Post({
            url: escapeHtml(req.body.url),
            description: escapeHtml(req.body.description),
            username: escapeHtml(req.session.account.username),
            created_date: new Date()
        })

        await newPost.save()

        res.json({ status: "success" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err })
    }
})

router.post('/like', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const post = await req.models.Post.findById(req.body.postID)
        if (!post.likes.includes(req.session.account.username)) {
            post.likes.push(req.session.account.username)
            await post.save()
        }
        res.json({ status: "success" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err })
    }
})

router.post('/unlike', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const post = await req.models.Post.findById(req.body.postID)
        const userIndex = post.likes.indexOf(req.session.account.username)
        if (userIndex !== -1) {
            post.likes.splice(userIndex, 1)
            await post.save()
        }
        res.json({ status: "success" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err })
    }
})

router.get('/', async (req, res) => {
    try {
        const filter = req.query.username ? { username: req.query.username } : {}
        const posts = await req.models.Post.find(filter)

        const postData = await Promise.all(
            posts.map(async (post) => {
                const htmlPreview = await getURLPreview(post.url)
                return {
                    id: post._id,
                    url: post.url,
                    description: post.description,
                    username: post.username,
                    likes: post.likes,
                    created_date: post.created_date,
                    htmlPreview: htmlPreview
                }
            })
        )

        res.json(postData)
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err })
    }
})

router.delete('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const post = await req.models.Post.findById(req.body.postID)
        
        if (post.username !== req.session.account.username) {
            return res.status(401).json({
                status: 'error',
                error: "you can only delete your own posts"
            })
        }

        await req.models.Comment.deleteMany({ post: post._id })
        await req.models.Post.deleteOne({ _id: post._id })

        res.json({ status: "success" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err })
    }
})

export default router