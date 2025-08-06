const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { body, query, validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const { auth, checkStorageLimit } = require('../middleware/auth');
const imageProcessor = require('../utils/imageProcessor');

const router = express.Router();

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, '../uploads');
const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');

fs.ensureDirSync(uploadDir);
fs.ensureDirSync(thumbnailDir);

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (imageProcessor.isSupportedFormat(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('지원되지 않는 파일 형식입니다.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // 최대 10개 파일
  }
});

// 사진 업로드 (개발 모드용 더미 응답)
router.post('/upload', auth, checkStorageLimit, upload.array('photos', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '업로드할 파일을 선택해주세요.' });
    }

    // 개발 모드에서는 더미 응답
    if (process.env.NODE_ENV !== 'production') {
      const dummyPhotos = req.files.map((file, index) => ({
        id: `dummy-photo-${index}`,
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimeType: file.mimetype,
        width: 1920,
        height: 1080,
        url: `/uploads/${file.filename}`,
        thumbnailUrl: `/uploads/thumbnails/thumb_${file.filename}`,
        analysis: {
          isDuplicate: false,
          isBlurry: false,
          isScreenshot: false,
          quality: 85,
          brightness: 0.6,
          contrast: 0.7,
          sharpness: 0.8
        },
        isFavorite: false,
        tags: [],
        createdAt: new Date()
      }));

      return res.json({
        message: '사진이 성공적으로 업로드되었습니다. (개발 모드)',
        photos: dummyPhotos,
        totalUploaded: dummyPhotos.length
      });
    }

    // 프로덕션에서는 실제 처리
    const uploadedPhotos = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // 파일 해시 생성
        const hash = await imageProcessor.generateHash(file.path);
        
        // 이미지 품질 분석
        const analysis = await imageProcessor.analyzeQuality(file.path);
        
        // 썸네일 생성
        const thumbnailFilename = `thumb_${path.basename(file.filename)}`;
        const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
        await imageProcessor.createThumbnail(file.path, thumbnailPath);

        // 사진 정보 저장
        const photo = new Photo({
          user: req.user._id,
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          thumbnailPath: thumbnailFilename,
          size: file.size,
          mimeType: file.mimetype,
          width: analysis.width,
          height: analysis.height,
          hash: hash,
          perceptualHash: await imageProcessor.generatePerceptualHash(file.path),
          analysis: {
            isDuplicate: false,
            isBlurry: analysis.quality < req.user.preferences.qualityThreshold,
            isScreenshot: analysis.isScreenshot,
            quality: analysis.quality,
            brightness: analysis.brightness,
            contrast: analysis.contrast,
            sharpness: analysis.sharpness
          }
        });

        await photo.save();
        uploadedPhotos.push(photo);

        // 사용자 저장 공간 업데이트
        await req.user.updateStorageUsed(file.size);

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
        
        // 실패한 파일 삭제
        try {
          await fs.remove(file.path);
        } catch (removeError) {
          console.error('Failed to remove file:', removeError);
        }
      }
    }

    res.json({
      message: `${uploadedPhotos.length}개 파일이 성공적으로 업로드되었습니다.`,
      uploaded: uploadedPhotos.length,
      errors: errors.length > 0 ? errors : undefined,
      photos: uploadedPhotos
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

// 사진 목록 조회 (개발 모드용 더미 응답)
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('한 번에 최대 100개까지 조회 가능합니다'),
  query('status').optional().isIn(['active', 'trash', 'deleted']).withMessage('유효하지 않은 상태입니다'),
  query('sort').optional().isIn(['date-desc', 'date-asc', 'size-desc', 'size-asc', 'name-asc', 'name-desc']).withMessage('유효하지 않은 정렬 옵션입니다'),
  query('filter').optional().isIn(['all', 'duplicates', 'blurry', 'screenshots', 'favorites']).withMessage('유효하지 않은 필터입니다')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '쿼리 파라미터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 20,
      status = 'active',
      sort = 'date-desc',
      filter = 'all'
    } = req.query;

    // 개발 모드에서는 더미 응답
    if (process.env.NODE_ENV !== 'production') {
      const dummyPhotos = Array.from({ length: Math.min(limit, 10) }, (_, index) => ({
        id: `dummy-photo-${index}`,
        originalName: `sample-photo-${index + 1}.jpg`,
        filename: `dummy-${index + 1}.jpg`,
        size: 1024 * 1024 * (Math.random() * 5 + 1), // 1-6MB
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        url: `/uploads/dummy-${index + 1}.jpg`,
        thumbnailUrl: `/uploads/thumbnails/thumb_dummy-${index + 1}.jpg`,
        analysis: {
          isDuplicate: Math.random() > 0.8,
          isBlurry: Math.random() > 0.7,
          isScreenshot: Math.random() > 0.9,
          quality: Math.random() * 100,
          brightness: Math.random(),
          contrast: Math.random(),
          sharpness: Math.random()
        },
        isFavorite: Math.random() > 0.7,
        tags: ['sample', 'test'],
        status: status,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 최근 30일 내
      }));

      return res.json({
        photos: dummyPhotos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 50,
          totalPages: Math.ceil(50 / limit),
          hasNext: page < Math.ceil(50 / limit),
          hasPrev: page > 1
        }
      });
    }

    // 프로덕션에서는 실제 MongoDB 사용
    const query = { user: req.user._id, status };

    // 필터 적용
    switch (filter) {
      case 'duplicates':
        query['analysis.isDuplicate'] = true;
        break;
      case 'blurry':
        query['analysis.isBlurry'] = true;
        break;
      case 'screenshots':
        query['analysis.isScreenshot'] = true;
        break;
      case 'favorites':
        query.favorite = true;
        break;
    }

    // 정렬 조건 구성
    let sortOption = {};
    switch (sort) {
      case 'date-desc':
        sortOption = { createdAt: -1 };
        break;
      case 'date-asc':
        sortOption = { createdAt: 1 };
        break;
      case 'size-desc':
        sortOption = { size: -1 };
        break;
      case 'size-asc':
        sortOption = { size: 1 };
        break;
      case 'name-asc':
        sortOption = { originalName: 1 };
        break;
      case 'name-desc':
        sortOption = { originalName: -1 };
        break;
    }

    // 페이지네이션
    const skip = (page - 1) * limit;
    
    const [photos, total] = await Promise.all([
      Photo.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Photo.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      photos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: '사진 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 사진 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!photo) {
      return res.status(404).json({ error: '사진을 찾을 수 없습니다.' });
    }

    // 조회수 증가
    photo.views += 1;
    await photo.save();

    res.json({ photo });

  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: '사진 조회 중 오류가 발생했습니다.' });
  }
});

// 사진 삭제 (휴지통으로 이동)
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!photo) {
      return res.status(404).json({ error: '사진을 찾을 수 없습니다.' });
    }

    photo.status = 'trash';
    await photo.save();

    res.json({ message: '사진이 휴지통으로 이동되었습니다.' });

  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: '사진 삭제 중 오류가 발생했습니다.' });
  }
});

// 사진 복원
router.put('/:id/restore', auth, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'trash'
    });

    if (!photo) {
      return res.status(404).json({ error: '복원할 사진을 찾을 수 없습니다.' });
    }

    photo.status = 'active';
    await photo.save();

    res.json({ message: '사진이 복원되었습니다.' });

  } catch (error) {
    console.error('Restore photo error:', error);
    res.status(500).json({ error: '사진 복원 중 오류가 발생했습니다.' });
  }
});

// 사진 영구 삭제
router.delete('/:id/permanent', auth, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'trash'
    });

    if (!photo) {
      return res.status(404).json({ error: '삭제할 사진을 찾을 수 없습니다.' });
    }

    // 파일 삭제
    try {
      await fs.remove(photo.path);
      if (photo.thumbnailPath) {
        await fs.remove(path.join(thumbnailDir, photo.thumbnailPath));
      }
    } catch (fileError) {
      console.error('File deletion error:', fileError);
    }

    // 사용자 저장 공간 업데이트
    await req.user.updateStorageUsed(-photo.size);

    // 데이터베이스에서 삭제
    await Photo.findByIdAndDelete(photo._id);

    res.json({ message: '사진이 영구 삭제되었습니다.' });

  } catch (error) {
    console.error('Permanent delete error:', error);
    res.status(500).json({ error: '사진 영구 삭제 중 오류가 발생했습니다.' });
  }
});

// 중복 사진 검색
router.post('/duplicates', auth, async (req, res) => {
  try {
    const duplicates = await Photo.findDuplicates(req.user._id);
    
    res.json({
      message: `${duplicates.length}개의 중복 사진을 발견했습니다.`,
      duplicates
    });

  } catch (error) {
    console.error('Find duplicates error:', error);
    res.status(500).json({ error: '중복 사진 검색 중 오류가 발생했습니다.' });
  }
});

// 흐릿한 사진 검색
router.post('/blurry', auth, [
  body('threshold').optional().isFloat({ min: 0, max: 1 }).withMessage('임계값은 0-1 사이의 값이어야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const threshold = req.body.threshold || req.user.preferences.qualityThreshold;
    const blurryPhotos = await Photo.findBlurryPhotos(req.user._id, threshold);
    
    res.json({
      message: `${blurryPhotos.length}개의 흐릿한 사진을 발견했습니다.`,
      blurryPhotos
    });

  } catch (error) {
    console.error('Find blurry photos error:', error);
    res.status(500).json({ error: '흐릿한 사진 검색 중 오류가 발생했습니다.' });
  }
});

// 스크린샷 검색
router.get('/screenshots', auth, async (req, res) => {
  try {
    const screenshots = await Photo.findScreenshots(req.user._id);
    
    res.json({
      message: `${screenshots.length}개의 스크린샷을 발견했습니다.`,
      screenshots
    });

  } catch (error) {
    console.error('Find screenshots error:', error);
    res.status(500).json({ error: '스크린샷 검색 중 오류가 발생했습니다.' });
  }
});

// 사진 즐겨찾기 토글
router.put('/:id/favorite', auth, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'active'
    });

    if (!photo) {
      return res.status(404).json({ error: '사진을 찾을 수 없습니다.' });
    }

    photo.favorite = !photo.favorite;
    await photo.save();

    res.json({
      message: photo.favorite ? '즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 제거되었습니다.',
      favorite: photo.favorite
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: '즐겨찾기 토글 중 오류가 발생했습니다.' });
  }
});

// 사진 태그 추가/제거
router.put('/:id/tags', auth, [
  body('tags').isArray().withMessage('태그는 배열이어야 합니다'),
  body('tags.*').isString().trim().isLength({ min: 1, max: 20 }).withMessage('태그는 1-20자 사이여야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array() 
      });
    }

    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'active'
    });

    if (!photo) {
      return res.status(404).json({ error: '사진을 찾을 수 없습니다.' });
    }

    photo.tags = req.body.tags;
    await photo.save();

    res.json({
      message: '태그가 업데이트되었습니다.',
      tags: photo.tags
    });

  } catch (error) {
    console.error('Update tags error:', error);
    res.status(500).json({ error: '태그 업데이트 중 오류가 발생했습니다.' });
  }
});

// 통계 정보 조회 (개발 모드용 더미 응답)
router.get('/stats/summary', auth, async (req, res) => {
  try {
    // 개발 모드에서는 더미 응답
    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        totalPhotos: 50,
        duplicatePhotos: 8,
        blurryPhotos: 12,
        screenshotPhotos: 5,
        favoritePhotos: 15,
        storageUsed: 1024 * 1024 * 150, // 150MB
        storageLimit: 1024 * 1024 * 100, // 100MB
        storagePercentage: 150
      });
    }

    // 프로덕션에서는 실제 MongoDB 사용
    const [
      totalPhotos,
      duplicatePhotos,
      blurryPhotos,
      screenshotPhotos,
      favoritePhotos,
      storageUsed
    ] = await Promise.all([
      Photo.countDocuments({ user: req.user._id, status: 'active' }),
      Photo.countDocuments({ user: req.user._id, status: 'active', 'analysis.isDuplicate': true }),
      Photo.countDocuments({ user: req.user._id, status: 'active', 'analysis.isBlurry': true }),
      Photo.countDocuments({ user: req.user._id, status: 'active', 'analysis.isScreenshot': true }),
      Photo.countDocuments({ user: req.user._id, status: 'active', favorite: true }),
      Photo.getStorageUsed(req.user._id)
    ]);

    res.json({
      totalPhotos,
      duplicatePhotos,
      blurryPhotos,
      screenshotPhotos,
      favoritePhotos,
      storageUsed,
      storageLimit: req.user.storageLimit,
      storagePercentage: (storageUsed / req.user.storageLimit) * 100
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 