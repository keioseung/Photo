# Cleanup Pro - 코드스페이스 설정 가이드

## 🚀 전체 설치 및 실행 명령어

### 1. 의존성 설치
```bash
# 루트 디렉토리에서 전체 의존성 설치
npm run install-all
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성 (필요한 경우)
cp env.example .env
```

### 3. 개발 서버 실행
```bash
# 클라이언트와 서버 동시 실행
npm run dev
```

### 4. 프로덕션 빌드
```bash
# 클라이언트 빌드
npm run build
```

### 5. 프로덕션 서버 실행
```bash
# 프로덕션 모드로 서버 실행
npm start
```

## 📋 개별 설치 명령어 (문제 발생 시)

### 루트 의존성만 설치
```bash
npm install
```

### 서버 의존성만 설치
```bash
cd server && npm install
```

### 클라이언트 의존성만 설치
```bash
cd client && npm install
```

## 🔧 문제 해결

### 포트 충돌 시
```bash
# 포트 확인
lsof -i :3000
lsof -i :5000

# 프로세스 종료
kill -9 [PID]
```

### 캐시 클리어
```bash
# npm 캐시 클리어
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Railway 배포 준비

### 1. 환경 변수 확인
- `MONGODB_URI`: MongoDB 연결 문자열
- `JWT_SECRET`: JWT 토큰 시크릿
- `NODE_ENV`: production으로 설정

### 2. 빌드 테스트
```bash
npm run build
npm start
```

## 📝 Git 업데이트 명령어

### 변경사항 커밋 및 푸시
```bash
# 변경사항 확인
git status

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "Update: 의존성 설치 및 설정 완료"

# 푸시
git push origin main
```

### 특정 파일만 커밋
```bash
# 특정 파일만 추가
git add package.json package-lock.json

# 커밋
git commit -m "Update: 의존성 업데이트"

# 푸시
git push origin main
```

## 🎯 코드스페이스에서 실행할 전체 명령어 시퀀스

```bash
# 1. 전체 의존성 설치
npm run install-all

# 2. 환경 변수 설정 (필요한 경우)
cp env.example .env

# 3. 개발 서버 실행 (백그라운드)
npm run dev &

# 4. 변경사항 커밋 및 푸시
git add .
git commit -m "Setup: 코드스페이스 환경 설정 완료"
git push origin main
```

## 📊 상태 확인 명령어

```bash
# 프로세스 확인
ps aux | grep node

# 포트 사용 확인
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# 디스크 사용량 확인
du -sh node_modules/
du -sh client/node_modules/
du -sh server/node_modules/
```

## ⚠️ 주의사항

1. **포트**: 클라이언트는 3000번, 서버는 5000번 포트 사용
2. **환경 변수**: `.env` 파일이 올바르게 설정되었는지 확인
3. **MongoDB**: MongoDB 연결이 필요합니다
4. **메모리**: 이미지 처리 시 충분한 메모리가 필요합니다

## 🔗 유용한 링크

- [Railway 배포 가이드](https://docs.railway.app/)
- [MongoDB Atlas 설정](https://docs.atlas.mongodb.com/)
- [Node.js 버전 확인](https://nodejs.org/) 