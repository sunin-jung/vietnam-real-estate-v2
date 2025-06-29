# Vietnam Real Estate Platform

베트남 부동산 매물, 인테리어, 법률자문 전문 플랫폼입니다.

## 🚀 주요 기능

- **부동산 매물 관리**: 호치민, 하노이, 다낭 지역의 매물 검색 및 상세 정보
- **관리자 대시보드**: 매물 등록, 수정, 삭제 기능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **실시간 검색**: 지역, 가격, 면적별 필터링
- **SEO 최적화**: 메타데이터 및 Open Graph 지원

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Swiper, Custom Components

## 📦 설치 및 실행

### 로컬 개발 환경

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd vietnam-real-estate
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드 및 배포

1. **프로덕션 빌드**
   ```bash
   npm run build
   ```

2. **프로덕션 서버 실행**
   ```bash
   npm start
   ```

## 🌐 배포 가이드

### Vercel 배포 (권장)

1. **Vercel 계정 생성**
   - [Vercel](https://vercel.com)에서 GitHub 계정으로 로그인

2. **프로젝트 연결**
   - GitHub 저장소를 Vercel에 연결
   - 자동으로 배포 설정 감지

3. **환경 변수 설정**
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   ```

4. **배포 완료**
   - 자동으로 배포가 완료됩니다

### Netlify 배포

1. **Netlify 계정 생성**
   - [Netlify](https://netlify.com)에서 GitHub 계정으로 로그인

2. **빌드 설정**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **환경 변수 설정**
   - Netlify 대시보드에서 환경 변수 추가

### Docker 배포

1. **Dockerfile 생성**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Docker 이미지 빌드**
   ```bash
   docker build -t vietnam-real-estate .
   ```

3. **컨테이너 실행**
   ```bash
   docker run -p 3000:3000 vietnam-real-estate
   ```

## 📁 프로젝트 구조

```
vietnam-real-estate/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   ├── properties/     # 매물 페이지
│   │   └── layout.tsx      # 루트 레이아웃
│   ├── components/         # 재사용 가능한 컴포넌트
│   ├── lib/               # 유틸리티 라이브러리
│   ├── types/             # TypeScript 타입 정의
│   └── utils/             # 유틸리티 함수
├── public/                # 정적 파일
├── next.config.js         # Next.js 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── package.json           # 프로젝트 의존성
```

## 🔧 스크립트 명령어

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - 코드 린팅
- `npm run lint:fix` - 린팅 오류 자동 수정
- `npm run type-check` - TypeScript 타입 검사
- `npm run clean` - 빌드 파일 정리

## 🔐 관리자 접근

- **URL**: `/admin/login`
- **기본 계정**: admin / admin123
- **기능**: 매물 등록, 수정, 삭제

## 📱 반응형 지원

- **모바일**: 320px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상

## 🚀 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 분할**: 자동 코드 분할
- **캐싱**: 적절한 캐시 헤더 설정
- **압축**: Gzip 압축 활성화

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요. 