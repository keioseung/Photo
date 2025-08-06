const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일 주소를 입력해주세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true,
    maxlength: [50, '이름은 50자 이하여야 합니다']
  },
  avatar: {
    type: String,
    default: null
  },
  storageUsed: {
    type: Number,
    default: 0 // 바이트 단위
  },
  storageLimit: {
    type: Number,
    default: 5 * 1024 * 1024 * 1024 // 5GB 기본 제한
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    autoDeleteDuplicates: {
      type: Boolean,
      default: false
    },
    qualityThreshold: {
      type: Number,
      default: 0.7
    },
    language: {
      type: String,
      default: 'ko'
    }
  }
}, {
  timestamps: true
});

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 저장 공간 사용량 업데이트 메서드
userSchema.methods.updateStorageUsed = async function(bytes) {
  this.storageUsed = Math.max(0, this.storageUsed + bytes);
  return await this.save();
};

// 저장 공간 확인 메서드
userSchema.methods.hasStorageSpace = function(bytes) {
  return this.storageUsed + bytes <= this.storageLimit;
};

// JSON 변환 시 비밀번호 제외
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// 인덱스 설정
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema); 