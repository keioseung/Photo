const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

class ImageProcessor {
  constructor() {
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
  }

  // 파일 해시 생성
  async generateHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => {
        hash.update(data);
      });
      
      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  // 지각적 해시 생성 (유사한 이미지 감지용)
  async generatePerceptualHash(filePath) {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // 이미지를 8x8로 리사이즈하고 그레이스케일로 변환
      const resized = await image
        .resize(8, 8, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer();
      
      // 평균값 계산
      const pixels = new Uint8Array(resized);
      const sum = pixels.reduce((acc, pixel) => acc + pixel, 0);
      const average = sum / pixels.length;
      
      // 해시 생성
      let hash = '';
      for (let i = 0; i < pixels.length; i++) {
        hash += pixels[i] > average ? '1' : '0';
      }
      
      return hash;
    } catch (error) {
      console.error('Perceptual hash generation error:', error);
      return null;
    }
  }

  // 이미지 품질 분석
  async analyzeQuality(filePath) {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // 이미지를 그레이스케일로 변환하여 분석
      const grayscale = await image
        .grayscale()
        .raw()
        .toBuffer();
      
      const pixels = new Uint8Array(grayscale);
      const width = metadata.width;
      const height = metadata.height;
      
      // 밝기 분석
      const brightness = this.calculateBrightness(pixels);
      
      // 대비 분석
      const contrast = this.calculateContrast(pixels);
      
      // 선명도 분석
      const sharpness = this.calculateSharpness(pixels, width, height);
      
      // 종합 품질 점수 (0-1)
      const quality = this.calculateOverallQuality(brightness, contrast, sharpness);
      
      // 스크린샷 감지
      const isScreenshot = this.detectScreenshot(pixels, width, height);
      
      return {
        quality,
        brightness,
        contrast,
        sharpness,
        isScreenshot,
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      console.error('Image quality analysis error:', error);
      return {
        quality: 0.5,
        brightness: 0.5,
        contrast: 0.5,
        sharpness: 0.5,
        isScreenshot: false,
        width: null,
        height: null
      };
    }
  }

  // 밝기 계산
  calculateBrightness(pixels) {
    const sum = pixels.reduce((acc, pixel) => acc + pixel, 0);
    return sum / pixels.length / 255; // 0-1 범위로 정규화
  }

  // 대비 계산
  calculateContrast(pixels) {
    const mean = pixels.reduce((acc, pixel) => acc + pixel, 0) / pixels.length;
    const variance = pixels.reduce((acc, pixel) => acc + Math.pow(pixel - mean, 2), 0) / pixels.length;
    const stdDev = Math.sqrt(variance);
    return Math.min(stdDev / 128, 1); // 0-1 범위로 정규화
  }

  // 선명도 계산 (Laplacian 필터 사용)
  calculateSharpness(pixels, width, height) {
    let sharpnessSum = 0;
    let count = 0;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const current = pixels[idx];
        
        // Laplacian 필터 적용
        const laplacian = Math.abs(
          4 * current -
          pixels[idx - 1] - // 왼쪽
          pixels[idx + 1] - // 오른쪽
          pixels[idx - width] - // 위
          pixels[idx + width]   // 아래
        );
        
        sharpnessSum += laplacian;
        count++;
      }
    }
    
    const averageSharpness = sharpnessSum / count;
    return Math.min(averageSharpness / 255, 1); // 0-1 범위로 정규화
  }

  // 종합 품질 점수 계산
  calculateOverallQuality(brightness, contrast, sharpness) {
    // 각 요소에 가중치 적용
    const brightnessWeight = 0.2;
    const contrastWeight = 0.3;
    const sharpnessWeight = 0.5;
    
    // 밝기가 너무 낮거나 높으면 페널티
    const brightnessScore = brightness < 0.1 || brightness > 0.9 ? 0.3 : 1.0;
    
    return (
      brightnessScore * brightnessWeight +
      contrast * contrastWeight +
      sharpness * sharpnessWeight
    );
  }

  // 스크린샷 감지
  detectScreenshot(pixels, width, height) {
    // 스크린샷의 특징: 텍스트가 많고, 색상이 단조로움
    let textLikePixels = 0;
    let totalPixels = pixels.length;
    
    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i];
      // 매우 어두운 픽셀 (텍스트일 가능성)
      if (pixel < 50) {
        textLikePixels++;
      }
    }
    
    const textRatio = textLikePixels / totalPixels;
    return textRatio > 0.1; // 10% 이상이 어두운 픽셀이면 스크린샷으로 간주
  }

  // 썸네일 생성
  async createThumbnail(filePath, outputPath, size = 300) {
    try {
      await sharp(filePath)
        .resize(size, size, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      
      return true;
    } catch (error) {
      console.error('Thumbnail creation error:', error);
      return false;
    }
  }

  // 이미지 메타데이터 추출
  async extractMetadata(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      
      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
        hasProfile: metadata.hasProfile,
        isOpaque: metadata.isOpaque,
        orientation: metadata.orientation
      };
    } catch (error) {
      console.error('Metadata extraction error:', error);
      return null;
    }
  }

  // 이미지 최적화
  async optimizeImage(filePath, outputPath, options = {}) {
    const {
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'jpeg'
    } = options;
    
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // 리사이즈가 필요한지 확인
      const needsResize = metadata.width > maxWidth || metadata.height > maxHeight;
      
      if (needsResize) {
        image.resize(maxWidth, maxHeight, { 
          fit: 'inside',
          withoutEnlargement: true 
        });
      }
      
      // 포맷별 최적화
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          await image.jpeg({ quality }).toFile(outputPath);
          break;
        case 'png':
          await image.png({ quality }).toFile(outputPath);
          break;
        case 'webp':
          await image.webp({ quality }).toFile(outputPath);
          break;
        default:
          await image.jpeg({ quality }).toFile(outputPath);
      }
      
      return true;
    } catch (error) {
      console.error('Image optimization error:', error);
      return false;
    }
  }

  // 지원되는 이미지 형식인지 확인
  isSupportedFormat(filename) {
    const ext = path.extname(filename).toLowerCase().slice(1);
    return this.supportedFormats.includes(ext);
  }

  // 파일 크기 포맷팅
  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

module.exports = new ImageProcessor(); 