# 🚀 Railway 배포 가이드

## 📋 사전 준비사항

### 1. Railway 계정 생성
- [Railway.app](https://railway.app)에서 GitHub 계정으로 로그인
- 새 프로젝트 생성

### 2. MongoDB Atlas 설정 (선택사항)
- [MongoDB Atlas](https://www.mongodb.com/atlas)에서 무료 클러스터 생성
- 데이터베이스 연결 문자열 복사

## 🔧 Railway 환경변수 설정

### 필수 환경변수

```bash
# 서버 설정
PORT=3020
NODE_ENV=production

# JWT 보안
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB 연결 (Atlas 사용시)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleanup-pro?retryWrites=true&w=majority

# 클라이언트 설정
REACT_APP_API_URL=https://your-railway-domain.railway.app/api
```

### 선택적 환경변수

```bash
# 파일 업로드 설정
MAX_FILE_SIZE=52428800
UPLOAD_PATH=uploads

# 보안 설정
CORS_ORIGIN=https://your-frontend-domain.railway.app
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 📦 Railway 배포 단계

### 1. GitHub 저장소 연결
```bash
# Railway 대시보드에서
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. GitHub 저장소 연결
4. 저장소 선택: keioseung/Photo
```

### 2. 환경변수 설정
```bash
# Railway 대시보드에서
1. 프로젝트 선택
2. "Variables" 탭 클릭
3. 위의 환경변수들을 추가
```

### 3. 빌드 설정 확인
```bash
# railway.json 파일이 이미 설정되어 있음
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 4. 배포 실행
```bash
# Railway가 자동으로 배포를 시작함
# 배포 로그 확인
# 도메인 URL 복사
```

## 🔗 도메인 설정

### 1. 커스텀 도메인 (선택사항)
```bash
# Railway 대시보드에서
1. "Settings" 탭 클릭
2. "Domains" 섹션에서 커스텀 도메인 추가
3. DNS 설정 업데이트
```

### 2. 환경변수 업데이트
```bash
# 커스텀 도메인 사용시
CORS_ORIGIN=https://your-custom-domain.com
REACT_APP_API_URL=https://your-custom-domain.com/api
```

## 🧪 배포 후 테스트

### 1. 헬스체크 확인
```bash
# 브라우저에서 확인
https://your-railway-domain.railway.app/api/health
# 응답: {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. API 테스트
```bash
# 회원가입 테스트
curl -X POST https://your-railway-domain.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. 프론트엔드 테스트
```bash
# 브라우저에서 접속
https://your-railway-domain.railway.app
# 로그인/회원가입 기능 테스트
```

## 🔒 보안 설정

### 1. JWT 시크릿 키 생성
```bash
# 터미널에서 실행
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# 생성된 키를 JWT_SECRET에 설정
```

### 2. 환경변수 보안
```bash
# 민감한 정보는 Railway의 환경변수로 설정
# 절대 코드에 하드코딩하지 않음
# .env 파일은 .gitignore에 포함
```

## 📊 모니터링

### 1. Railway 대시보드
```bash
# 실시간 로그 확인
# 리소스 사용량 모니터링
# 에러 알림 설정
```

### 2. 애플리케이션 로그
```bash
# Railway CLI로 로그 확인
railway logs
```

## 🚨 문제 해결

### 1. 빌드 실패
```bash
# 로그 확인
railway logs

# 일반적인 문제들:
# - 환경변수 누락
# - 포트 충돌
# - 의존성 설치 실패
```

### 2. 런타임 에러
```bash
# MongoDB 연결 확인
# JWT 시크릿 키 확인
# CORS 설정 확인
```

### 3. 성능 최적화
```bash
# 이미지 압축 활성화
# 캐싱 설정
# CDN 사용 고려
```

## 📈 스케일링

### 1. 자동 스케일링
```bash
# Railway는 자동으로 트래픽에 따라 스케일링
# 필요시 수동으로 인스턴스 수 조정
```

### 2. 리소스 업그레이드
```bash
# 프로젝트 성장에 따라
# 더 많은 CPU/메모리 할당
# 더 큰 저장공간 확보
```

## 💰 비용 관리

### 1. 무료 티어
```bash
# 월 $5 크레딧 제공
# 소규모 프로젝트에 적합
```

### 2. 유료 플랜
```bash
# 프로덕션 환경에 권장
# 더 많은 리소스와 기능
# 24/7 지원
```

## 🎯 최종 체크리스트

- [ ] GitHub 저장소 연결
- [ ] 환경변수 설정 완료
- [ ] MongoDB 연결 확인
- [ ] JWT 시크릿 키 설정
- [ ] 도메인 설정 완료
- [ ] 헬스체크 통과
- [ ] API 테스트 완료
- [ ] 프론트엔드 테스트 완료
- [ ] 보안 설정 확인
- [ ] 모니터링 설정

## 🚀 배포 완료!

이제 시장에 출시할 준비가 완료되었습니다!

**앱 URL**: https://your-railway-domain.railway.app
**API URL**: https://your-railway-domain.railway.app/api

**주요 기능:**
- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 사진 업로드 및 관리
- ✅ 중복 사진 감지
- ✅ 품질 분석
- ✅ 스크린샷 분류
- ✅ 반응형 웹 디자인
- ✅ 실시간 통계
- ✅ 직관적 UI/UX 