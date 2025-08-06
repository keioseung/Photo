const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 회원가입
router.post('/register', [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage('비밀번호는 영문과 숫자를 포함해야 합니다'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다')
], async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const { email, password, name } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 사용자 생성
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // 토큰 생성
    const token = generateToken(user._id);

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요')
], async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date();
    await user.save();

    // 토큰 생성
    const token = generateToken(user._id);

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});

// 사용자 정보 조회
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // 저장 공간 사용량 업데이트
    const storageUsed = await require('../models/Photo').getStorageUsed(user._id);
    user.storageUsed = storageUsed;
    await user.save();

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
    console.error('Get user info error:', error);
    res.status(500).json({ error: '사용자 정보 조회 중 오류가 발생했습니다.' });
  }
});

// 사용자 정보 업데이트
router.put('/me', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다'),
  body('preferences.autoDeleteDuplicates')
    .optional()
    .isBoolean()
    .withMessage('자동 삭제 설정은 boolean 값이어야 합니다'),
  body('preferences.qualityThreshold')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('품질 임계값은 0-1 사이의 값이어야 합니다')
], async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const { name, preferences } = req.body;
    const user = req.user;

    // 업데이트할 필드 설정
    if (name) user.name = name;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      message: '사용자 정보가 업데이트되었습니다.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isPremium: user.isPremium,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update user info error:', error);
    res.status(500).json({ error: '사용자 정보 업데이트 중 오류가 발생했습니다.' });
  }
});

// 비밀번호 변경
router.put('/password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('현재 비밀번호를 입력해주세요'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('새 비밀번호는 최소 6자 이상이어야 합니다')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage('새 비밀번호는 영문과 숫자를 포함해야 합니다')
], async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
    }

    // 새 비밀번호 설정
    user.password = newPassword;
    await user.save();

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
  }
});

// 계정 삭제
router.delete('/me', auth, [
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요')
], async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const { password } = req.body;
    const user = req.user;

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: '비밀번호가 올바르지 않습니다.' });
    }

    // 사용자 삭제 (실제로는 soft delete를 권장)
    await User.findByIdAndDelete(user._id);

    res.json({ message: '계정이 성공적으로 삭제되었습니다.' });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: '계정 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 