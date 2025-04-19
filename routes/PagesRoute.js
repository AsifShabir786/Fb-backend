const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGroup,createPost,
  joinGroup,
  leaveGroup,
  getGroups,
  getGroupPosts
} = require('../controllers/pagesController');
const { multerMiddleware } = require('../config/cloudinary');
 
const router = express.Router();
router.post('/PagesGroup',multerMiddleware.single('media'),createPost)

router.post('/Pages', createGroup);
router.post('/Pages/join/:groupId', joinGroup);
router.post('/Pages/leave/:groupId', authMiddleware, leaveGroup);
router.get('/Pages', getGroups);
router.get('/Pages/:groupId/posts', getGroupPosts);

module.exports = router;
