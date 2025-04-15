const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGroup,createPost,
  joinGroup,
  leaveGroup,
  getGroups,
  getGroupPosts
} = require('../controllers/groupController');
const { multerMiddleware } = require('../config/cloudinary');
 
const router = express.Router();
router.post('/postsGroup',multerMiddleware.single('media'),createPost)

router.post('/group', createGroup);
router.post('/group/join/:groupId', joinGroup);
router.post('/group/leave/:groupId', authMiddleware, leaveGroup);
router.get('/groups', getGroups);
router.get('/group/:groupId/posts', getGroupPosts);

module.exports = router;
