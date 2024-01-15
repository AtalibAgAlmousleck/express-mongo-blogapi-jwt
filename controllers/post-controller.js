
// protected url
const createPost = function(req, res, next){
    res.json('Create post method')
}

// un-protected url
const getPosts = function(req, res, next){
    res.json('get posts method')
}

// un-protected url
const getPost = function(req, res, next){
    res.json('get post method')
}

// un-protected url
const getCategoryPost = function(req, res, next){
    res.json('get category posts method')
}

// un-protected url
const getUserPosts = function(req, res, next){
    res.json('get category posts method')
}

// protected url
const editPost = function(req, res, next){
    res.json('get edit posts method')
}

// protected url
const deletePost = function(req, res, next){
    res.json('get delete posts method')
}

module.exports = {
    createPost,
    getPosts,
    getPost,
    getCategoryPost,
    getUserPosts,
    editPost,
    deletePost
}