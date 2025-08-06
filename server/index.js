const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3020;

// 개발 환경 설정
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.railway.app'] 
    : ['http://localhost:3010'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 요청 수
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});
app.use('/api/', limiter);

// Body parsing 미들웨어
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Production에서 React 앱 서빙
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// MongoDB 연결 (개발 모드에서는 선택적)
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
    console.log(`📱 환경: ${process.env.NODE_ENV || 'development'}`);
  });
};

if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
  // 프로덕션에서 MongoDB URI가 설정된 경우에만 연결
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
    console.log('⚠️ MongoDB 없이 서버를 시작합니다 (일부 기능 제한)');
    startServer();
  });
} else {
  // MongoDB URI가 없거나 개발 모드인 경우
  console.log('⚠️ MongoDB 없이 실행 중 (일부 기능 제한)');
  if (process.env.NODE_ENV === 'production') {
    console.log('💡 MongoDB Atlas를 사용하려면 MONGODB_URI 환경변수를 설정하세요');
  }
  startServer();
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신, 서버 종료 중...');
  mongoose.connection.close(() => {
    console.log('MongoDB 연결 종료');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호 수신, 서버 종료 중...');
  mongoose.connection.close(() => {
    console.log('MongoDB 연결 종료');
    process.exit(0);
  });
}); 