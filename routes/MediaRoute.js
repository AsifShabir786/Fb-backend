const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGroup,createPost,
  joinGroup,
  leaveGroup,
  getGroups,
  getGroupPosts
} = require('../controllers/MediaController');
const { multerMiddleware } = require('../config/cloudinary');
 
const router = express.Router();
router.post('/MediaGroup',multerMiddleware.single('media'),createPost)

router.post('/Media', createGroup);
router.post('/Media/join/:groupId', joinGroup);
router.post('/Media/leave/:groupId', authMiddleware, leaveGroup);
router.get('/Media', getGroups);
router.get('/Media/:groupId/posts', getGroupPosts);

module.exports = router;
