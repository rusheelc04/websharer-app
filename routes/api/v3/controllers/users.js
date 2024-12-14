import express from 'express'
var router = express.Router()

router.get('/myIdentity', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        })
    } else {
        res.json({ status: "loggedout" });
    }
})

router.get('/userInfo', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ status: 'error', error: 'username query parameter is required' })
        }
        const userInfo = await req.models.UserInfo.findOne({ username })
        res.json(userInfo || { status: 'no_info', message: 'User info not found' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post('/userInfo', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({ status: 'error', error: 'not logged in' })
    }

    try {
        const { favoriteWebsite, bio } = req.body
        const username = req.session.account.username

        let userInfo = await req.models.UserInfo.findOne({ username })
        if (!userInfo) {
            userInfo = new req.models.UserInfo({ username })
        }

        if (favoriteWebsite) userInfo.favoriteWebsite = favoriteWebsite
        if (bio) userInfo.bio = bio

        await userInfo.save()
        res.json({ status: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router