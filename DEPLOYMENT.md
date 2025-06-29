# 배포 가이드 (Deployment Guide)

이 문서는 Vietnam Real Estate 플랫폼을 다양한 환경에 배포하는 방법을 설명합니다.

## 🚀 빠른 배포 (Vercel - 권장)

### 1. Vercel 계정 생성
- [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인

### 2. 프로젝트 연결
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 자동으로 Next.js 설정 감지됨

### 3. 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수를 추가:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

### 4. 배포 완료
- 자동으로 배포가 시작되고 완료됩니다
- 배포 URL: `https://your-project-name.vercel.app`

## 🌐 Netlify 배포

### 1. Netlify 계정 생성
- [Netlify](https://netlify.com)에 접속하여 GitHub 계정으로 로그인

### 2. 프로젝트 연결
1. "New site from Git" 클릭
2. GitHub 저장소 선택

### 3. 빌드 설정
```
Build command: npm run build
Publish directory: .next
```

### 4. 환경 변수 설정
Netlify 대시보드 → Site settings → Environment variables에서 추가:
```
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

## 🐳 Docker 배포

### 1. Docker 이미지 빌드
```bash
docker build -t vietnam-real-estate .
```

### 2. Docker 컨테이너 실행
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=admin123 \
  vietnam-real-estate
```

### 3. Docker Compose 사용
```bash
docker-compose up -d
```

## ☁️ AWS 배포

### 1. AWS Amplify 사용
1. AWS Amplify 콘솔에서 "New app" → "Host web app"
2. GitHub 저장소 연결
3. 빌드 설정:
   ```
   Build command: npm run build
   Publish directory: .next
   ```

### 2. AWS EC2 배포
1. EC2 인스턴스 생성 (Ubuntu 20.04 LTS)
2. Node.js 18 설치
3. 프로젝트 클론 및 빌드
4. PM2로 프로세스 관리

```bash
# EC2에서 실행할 명령어
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

git clone <your-repo>
cd vietnam-real-estate
npm install
npm run build
pm2 start npm --name "vietnam-real-estate" -- start
pm2 startup
pm2 save
```

## 🔧 환경 변수 설정

### 필수 환경 변수
```env
# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 관리자 계정
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password

# API URL (선택사항)
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 선택적 환경 변수
```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# 이미지 도메인
NEXT_PUBLIC_IMAGE_DOMAINS=images.unsplash.com,via.placeholder.com
```

## 📊 성능 최적화

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP/AVIF 포맷 지원
- 적절한 이미지 크기 설정

### 2. 캐싱 전략
- 정적 페이지: 적극적 캐싱
- 관리자 페이지: no-cache
- API 엔드포인트: no-cache

### 3. CDN 설정
- Vercel/Netlify: 자동 CDN
- AWS: CloudFront 설정
- 이미지: 별도 CDN 사용 권장

## 🔒 보안 설정

### 1. 관리자 계정 보안
- 강력한 비밀번호 사용
- 정기적인 비밀번호 변경
- 2FA 활성화 (향후 구현)

### 2. API 보안
- CORS 설정
- Rate limiting 적용
- HTTPS 강제 사용

### 3. 환경 변수 보안
- 민감한 정보는 환경 변수로 관리
- .env 파일을 Git에 커밋하지 않음
- 배포 플랫폼의 환경 변수 기능 활용

## 🚨 문제 해결

### 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm run clean
npm run build
```

### 런타임 오류
```bash
# 로그 확인
npm start

# 환경 변수 확인
echo $NEXT_PUBLIC_SITE_URL
```

### Docker 오류
```bash
# 이미지 재빌드
docker build --no-cache -t vietnam-real-estate .

# 컨테이너 로그 확인
docker logs <container-id>
```

## 📈 모니터링

### 1. 성능 모니터링
- Vercel Analytics
- Google Analytics
- Core Web Vitals

### 2. 에러 모니터링
- Sentry (선택사항)
- 배포 플랫폼 로그
- 사용자 피드백

### 3. 가용성 모니터링
- Uptime Robot
- Pingdom
- 배포 플랫폼 내장 모니터링

## 🔄 CI/CD 설정

### GitHub Actions 예시
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 지원

배포 관련 문제가 발생하면:
1. 이 문서의 문제 해결 섹션 확인
2. 배포 플랫폼 공식 문서 참조
3. GitHub Issues 생성 