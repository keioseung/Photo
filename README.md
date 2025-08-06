# 📸 Cleanup Pro - Professional Photo Cleanup Application

스마트 사진 정리 & 관리 도구로 중복 사진, 흐릿한 사진, 스크린샷을 자동으로 감지하고 정리할 수 있습니다.

## ✨ 주요 기능

- 🔍 **스마트 중복 감지**: 해시 기반 중복 사진 자동 감지
- 📊 **품질 분석**: 흐릿한 사진 자동 감지
- 🎯 **스와이프 인터페이스**: Tinder 스타일의 직관적인 정리 방식
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- 🗑️ **휴지통 시스템**: 안전한 삭제 및 복원 기능
- 📈 **실시간 통계**: 사진 현황 실시간 모니터링

## 🚀 빠른 시작

### 로컬 개발 환경

```bash
# 의존성 설치
npm run install-all

# 개발 서버 실행
npm run dev
```

### Railway 배포

1. Railway 계정 생성 및 프로젝트 생성
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `PORT`: 서버 포트 (기본값: 3020)
   - `NODE_ENV`: production
   - `JWT_SECRET`: JWT 시크릿 키
   - `REACT_APP_API_URL`: API URL
   - `DANGEROUSLY_DISABLE_HOST_CHECK`: true (Host header 문제 해결)
   - `MONGODB_URI`: MongoDB 연결 문자열 (선택사항)

## 🛠️ 기술 스택

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** 인증
- **Multer** 파일 업로드
- **Sharp** 이미지 처리
- **Crypto** 해시 생성

### Frontend
- **React** 18
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** 애니메이션
- **React Query** 상태 관리

## 📁 프로젝트 구조

```
cleanup-pro/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── services/      # API 서비스
│   │   └── types/         # TypeScript 타입
│   └── public/
├── server/                 # Node.js 백엔드
│   ├── controllers/       # 라우트 컨트롤러
│   ├── models/           # MongoDB 모델
│   ├── middleware/       # 미들웨어
│   ├── routes/           # API 라우트
│   └── utils/            # 유틸리티 함수
└── shared/               # 공유 타입 및 유틸리티
```

## 🔧 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 사용자 정보

### 사진 관리
- `POST /api/photos/upload` - 사진 업로드
- `GET /api/photos` - 사진 목록 조회
- `DELETE /api/photos/:id` - 사진 삭제
- `POST /api/photos/duplicates` - 중복 사진 검색
- `POST /api/photos/blurry` - 흐릿한 사진 검색

## 📱 사용법

1. **사진 업로드**: 드래그 앤 드롭 또는 파일 선택으로 사진 업로드
2. **스캔 실행**: 중복 사진 및 흐릿한 사진 자동 감지
3. **정리 모드**: 
   - 그리드 모드: 개별 선택 및 일괄 삭제
   - 스와이프 모드: 직관적인 스와이프로 빠른 정리
4. **휴지통 관리**: 삭제된 사진 복원 또는 영구 삭제

## 🔒 보안

- JWT 기반 인증
- 파일 업로드 검증
- CORS 설정
- Rate limiting
- 입력 데이터 검증

## 📊 성능 최적화

- 이미지 압축 및 리사이징
- 무한 스크롤
- 가상화된 리스트
- 메모이제이션
- CDN 지원

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 기능 요청이 있으시면 이슈를 생성해주세요. 