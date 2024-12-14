# Website Sharer with User Info

## **Description**
The **Website Sharer** is a full-stack web application designed to let users share links, interact with posts, and maintain personalized user profiles.

Users can:
- Share links to other websites with descriptions.
- View and interact with posts (like, unlike, comment).
- See a list of their own posts on their profile page.
- Update their profile with a bio and favorite website.

## **Live Deployment**
The project is deployed and available at (UW email login needed for authentication):

[https://a7-websharer-rchande4.azurewebsites.net/](https://a7-websharer-rchande4.azurewebsites.net/)

## **Features**
1. **Share and Manage Posts**
   - Create, view, like, unlike, comment on, and delete posts.
   - Posts include metadata like description, URL preview, and the number of likes.

2. **User Profiles**
   - View user-specific pages showing their posts and profile information.
   - Authenticated users can edit their own bio and favorite website.

3. **Authentication**
   - Uses Azure Active Directory authentication for secure login and session management.

4. **Responsive Design**
   - Built with Bootstrap for mobile-friendly layouts.

5. **Backend API**
   - Includes endpoints for managing posts, comments, and user information.

## **Technology Stack**
- **Frontend:** HTML, CSS, Bootstrap, JavaScript.
- **Backend:** Node.js, Express, Mongoose.
- **Database:** MongoDB (via MongoDB Atlas).
- **Deployment:** Azure App Services.

## **Endpoints**
### **Posts**
- `GET /api/v3/posts` – Fetch all posts or user-specific posts.
- `POST /api/v3/posts` – Create a new post.
- `POST /api/v3/posts/like` – Like a post.
- `POST /api/v3/posts/unlike` – Unlike a post.
- `DELETE /api/v3/posts` – Delete a user's post.

### **Comments**
- `GET /api/v3/comments` – Fetch comments for a post.
- `POST /api/v3/comments` – Add a comment to a post.

### **User Info**
- `GET /api/v3/users/userInfo` – Fetch user info (bio, favorite website).
- `POST /api/v3/users/userInfo` – Update user info.

## **How to Run Locally**
1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Install dependencies:
   ```bash
    npm install

3. Run the app locally:
   ```bash
    npm start

4. Open the app at http://localhost:3000.

## **Deployment**
The app is deployed on Azure App Services. For deployment, ensure the redirectUri in app.js points to the correct domain. UW email login needed for authentication.