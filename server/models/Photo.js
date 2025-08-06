const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String,
    default: null
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  hash: {
    type: String,
    required: true,
    index: true
  },
  perceptualHash: {
    type: String,
    default: null,
    index: true
  },
  metadata: {
    camera: String,
    dateTaken: Date,
    location: {
      latitude: Number,
      longitude: Number
    },
    tags: [String]
  },
  analysis: {
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isBlurry: {
      type: Boolean,
      default: false
    },
    isScreenshot: {
      type: Boolean,
      default: false
    },
    quality: {
      type: Number,
      default: null // 0-1 사이 값
    },
    brightness: {
      type: Number,
      default: null
    },
    contrast: {
      type: Number,
      default: null
    },
    sharpness: {
      type: Number,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['active', 'trash', 'deleted'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  favorite: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  duplicateGroup: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
}, {
  timestamps: true
});

// 가상 필드: URL
photoSchema.virtual('url').get(function() {
  return `/uploads/${this.filename}`;
});

photoSchema.virtual('thumbnailUrl').get(function() {
  return this.thumbnailPath ? `/uploads/${this.thumbnailPath}` : this.url;
});

// 가상 필드: 파일 크기 포맷
photoSchema.virtual('formattedSize').get(function() {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  let size = this.size;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < sizes.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${sizes[unitIndex]}`;
});

// 가상 필드: 해상도
photoSchema.virtual('resolution').get(function() {
  if (this.width && this.height) {
    return `${this.width} × ${this.height}`;
  }
  return 'Unknown';
});

// JSON 변환 시 가상 필드 포함
photoSchema.set('toJSON', { virtuals: true });
photoSchema.set('toObject', { virtuals: true });

// 인덱스 설정
photoSchema.index({ user: 1, createdAt: -1 });
photoSchema.index({ user: 1, status: 1 });
photoSchema.index({ hash: 1, user: 1 });
photoSchema.index({ perceptualHash: 1, user: 1 });
photoSchema.index({ 'analysis.isDuplicate': 1, user: 1 });
photoSchema.index({ 'analysis.isBlurry': 1, user: 1 });
photoSchema.index({ 'analysis.isScreenshot': 1, user: 1 });
photoSchema.index({ favorite: 1, user: 1 });
photoSchema.index({ tags: 1, user: 1 });

// 중복 사진 찾기 메서드
photoSchema.statics.findDuplicates = async function(userId) {
  const photos = await this.find({ 
    user: userId, 
    status: 'active' 
  }).sort({ createdAt: -1 });
  
  const hashGroups = {};
  const duplicates = [];
  
  photos.forEach(photo => {
    if (!hashGroups[photo.hash]) {
      hashGroups[photo.hash] = [];
    }
    hashGroups[photo.hash].push(photo);
  });
  
  Object.values(hashGroups).forEach(group => {
    if (group.length > 1) {
      // 첫 번째 사진은 원본으로 간주하고 나머지는 중복으로 표시
      group.slice(1).forEach(photo => {
        photo.analysis.isDuplicate = true;
        photo.duplicateGroup = group[0]._id;
        duplicates.push(photo);
      });
    }
  });
  
  // 중복 사진들을 데이터베이스에 업데이트
  for (const photo of duplicates) {
    await photo.save();
  }
  
  return duplicates;
};

// 흐릿한 사진 찾기 메서드
photoSchema.statics.findBlurryPhotos = async function(userId, threshold = 0.7) {
  return await this.find({
    user: userId,
    status: 'active',
    'analysis.quality': { $lt: threshold }
  }).sort({ createdAt: -1 });
};

// 스크린샷 찾기 메서드
photoSchema.statics.findScreenshots = async function(userId) {
  return await this.find({
    user: userId,
    status: 'active',
    'analysis.isScreenshot': true
  }).sort({ createdAt: -1 });
};

// 저장 공간 사용량 계산 메서드
photoSchema.statics.getStorageUsed = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'active' } },
    { $group: { _id: null, totalSize: { $sum: '$size' } } }
  ]);
  
  return result.length > 0 ? result[0].totalSize : 0;
};

module.exports = mongoose.model('Photo', photoSchema); 