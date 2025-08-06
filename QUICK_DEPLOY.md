# ⚡ Railway 빠른 배포 체크리스트

## 🚀 5분 배포 가이드

### 1단계: Railway 프로젝트 생성 (1분)
```bash
1. railway.app 접속
2. GitHub로 로그인
3. "New Project" 클릭
4. "Deploy from GitHub repo" 선택
5. keioseung/Photo 저장소 선택
```

### 2단계: JWT 시크릿 키 생성 (30초)
```bash
# 터미널에서 실행
node generate-jwt-secret.js
# 또는
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3단계: 환경변수 설정 (2분)
```bash
# Railway 대시보드 → Variables 탭에서 추가:

PORT=3020
NODE_ENV=production
JWT_SECRET=생성된_키_여기에_붙여넣기
REACT_APP_API_URL=https://your-railway-domain.railway.app/api
```

### 4단계: 배포 확인 (1분)
```bash
# 배포 로그 확인
# 도메인 URL 복사
# 브라우저에서 접속 테스트
```

## ✅ 완료 체크리스트

- [ ] Railway 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] JWT 시크릿 키 생성 및 설정
- [ ] 환경변수 설정 완료
- [ ] 배포 성공 확인
- [ ] 헬스체크 통과
- [ ] 로그인/회원가입 테스트

## 🔗 유용한 링크

- **Railway 대시보드**: https://railway.app/dashboard
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **프로젝트 저장소**: https://github.com/keioseung/Photo

## 🎯 배포 완료!

**앱 URL**: https://your-railway-domain.railway.app

**주요 기능:**
- ✅ 사용자 인증
- ✅ 사진 업로드
- ✅ 중복 감지
- ✅ 품질 분석
- ✅ 반응형 UI

**시장 출시 준비 완료!** 🚀 