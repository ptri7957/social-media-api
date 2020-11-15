# social-media-api

# Built With
<ul>
  <li>NodeJS</li>
  <li>Express</li>
  <li>MongoDB</li>
</ul>

# Features
<ul>
  <li>Create Posts</li>
  <li>Like Posts</li>
  <li>Comment on Posts</li>
  <li>Remove Posts</li>
  <li>Follow and unfollow users</li>
  <li>Register user and authentication</li>
</ul>

# Install
1. Install dependencies
```
npm i
```
2. Run the project
```
npm run start
```

3. Open an API tester such as postman and go to http://localhost:5000/. Endpoints are:
```
POST     /api/users
POST     /api/auth
GET      /api/auth
GET      /api/profile
GET      /api/profile/img/:imageName
POST     /api/profile
GET      /api/following?followee={userID}
POST     /api/following?user={userID}
DELETE   /api/following?user={userID}
GET      /api/posts?user={userID}
GET      /api/posts/following
GET      /api/posts/:ID
POST     /api/posts
DELETE   /api/posts/:ID
GET      /api/comments/:postID
POST     /api/comments/:postID
DELETE   /api/comments/:postID/:commentID
GET      /api/likes/:postID
POST     /api/likes/:postID
PUT      /api/likes/:postID

```

