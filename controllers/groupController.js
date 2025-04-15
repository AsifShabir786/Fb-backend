const Group = require('../model/Group');
const Post = require('../model/Post');
const response = require('../utils/responceHandler');

// Create Group
const createGroup = async (req, res) => {
  try {
    const { name, description,userId } = req.body;
    const adminId = userId;

    const group = new Group({
      name,
      description,
      admin: adminId,
      members: [adminId],
      memberCount: 1,
    });

    await group.save();
    return response(res, 201, 'Group created successfully', group);
  } catch (err) {
    return response(res, 500, 'Error creating group', err.message);
  }
};

// Join Group
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.body.userId || req?.user?.userId; // fallback to token if body not present

    const group = await Group.findById(groupId);
    if (!group) return response(res, 404, 'Group not found');

    if (group.members.includes(userId))
      return response(res, 400, 'Already a member');

    group.members.push(userId);
    group.memberCount += 1;
    await group.save();

    return response(res, 200, 'Joined group successfully', group);
  } catch (err) {
    return response(res, 500, 'Error joining group', err.message);
  }
};

// Leave Group
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) return response(res, 404, 'Group not found');

    if (!group.members.includes(userId))
      return response(res, 400, 'Not a member');

    group.members = group.members.filter(id => id.toString() !== userId);
    group.memberCount = Math.max(0, group.memberCount - 1);
    await group.save();

    return response(res, 200, 'Left group successfully', group);
  } catch (err) {
    return response(res, 500, 'Error leaving group', err.message);
  }
};

// Get all groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('admin', 'username profilePicture');
    return response(res, 200, 'Groups fetched successfully', groups);
  } catch (err) {
    return response(res, 500, 'Error fetching groups', err.message);
  }
};

const createPost = async(req,res) =>{
  try {
      // const userId = req.user.userId || req.body ;

      const {content,groupId,userId} = req.body;
      const file= req.file;
      let mediaUrl = null;
      let mediaType = null;

      if(file) {
        const uploadResult = await uploadFileToCloudinary(file)
        mediaUrl= uploadResult?.secure_url;
        mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
      }
     
      //create a new post
      const newPost = await new Post({
          user:userId,
          content,
          group: groupId || null,

          mediaUrl,
          mediaType,
          likeCount:0,
          commentCount:0,
          shareCount:0,
      })

      await newPost.save();
      return response(res,201,'Post created successfully', newPost)

  } catch (error) {
       console.log('error creating post',error)
       return response(res,500, 'Internal server error',error.message)
  }
}

// Get group posts
const getGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;
    const posts = await Post.find({ group: groupId })
      .populate('user', 'username profilePicture')
      .populate({
        path: 'comments.user',
        select: 'username profilePicture',
      })
      .sort({ createdAt: -1 });

    return response(res, 200, 'Group posts fetched', posts);
  } catch (err) {
    return response(res, 500, 'Error fetching group posts', err.message);
  }
};

module.exports = {
  createPost,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroups,
  getGroupPosts,
};
