const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 사용자 프로필 조회
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isPremium: user.isPremium,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: '프로필 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 