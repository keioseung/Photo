const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '토큰이 만료되었습니다.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
};

// 선택적 인증 (토큰이 있으면 사용자 정보를 설정, 없어도 통과)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 계속 진행
    next();
  }
};

// 프리미엄 사용자 확인
const requirePremium = async (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ 
      error: '프리미엄 기능입니다. 업그레이드가 필요합니다.' 
    });
  }
  next();
};

// 저장 공간 확인
const checkStorageLimit = async (req, res, next) => {
  try {
    const fileSize = req.file?.size || 0;
    
    if (!req.user.hasStorageSpace(fileSize)) {
      return res.status(413).json({ 
        error: '저장 공간이 부족합니다. 일부 파일을 삭제하거나 프리미엄으로 업그레이드하세요.' 
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  auth,
  optionalAuth,
  requirePremium,
  checkStorageLimit
}; 