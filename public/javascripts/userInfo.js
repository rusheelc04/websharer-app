async function init(){
    await loadIdentity()
    loadUserInfo()
}

async function saveUserInfo() {
    const favoriteWebsite = document.getElementById('favoriteWebsiteInput').value
    const bio = document.getElementById('bioInput').value

    try {
        await fetchJSON(`api/${apiVersion}/users/userInfo`, {
            method: 'POST',
            body: { favoriteWebsite, bio }
        })
        alert('User info saved successfully')
        loadUserInfo()
    } catch (err) {
        console.log(err)
        alert('Error saving user info.')
    }
}

async function loadUserInfo() {
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('user')

    if (!username) {
        document.getElementById('user_info_div').innerText = 'User not specified.'
        return
    }

    if (username == myIdentity) {
        document.getElementById("username-span").innerText = `You (${username})`
        document.getElementById("user_info_new_div").classList.remove("d-none")
    } else {
        document.getElementById("username-span").innerText = username
        document.getElementById("user_info_new_div").classList.add("d-none")
    }

    try {
        const userInfo = await fetchJSON(`api/${apiVersion}/users/userInfo?username=${encodeURIComponent(username)}`)
        document.getElementById('user_info_div').innerHTML = `
            <p><strong>Favorite Website:</strong> ${escapeHTML(userInfo.favoriteWebsite || 'Not set')}</p>
            <p><strong>Bio:</strong> ${escapeHTML(userInfo.bio || 'No bio available')}</p>
        `
    } catch (err) {
        console.log(err)
        document.getElementById('user_info_div').innerText = 'Error loading user info.'
    }

    loadUserInfoPosts(username)
}

async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading..."
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`)
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n")
    document.getElementById("posts_box").innerHTML = postsHtml
}

async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo()
}