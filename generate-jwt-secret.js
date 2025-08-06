#!/usr/bin/env node

/**
 * JWT 시크릿 키 생성 스크립트
 * Railway 배포시 사용할 안전한 JWT 시크릿 키를 생성합니다.
 */

const crypto = require('crypto');

console.log('🔐 JWT 시크릿 키 생성 중...\n');

// 64바이트 랜덤 키 생성
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ 생성된 JWT 시크릿 키:');
console.log('='.repeat(80));
console.log(jwtSecret);
console.log('='.repeat(80));

console.log('\n📋 Railway 환경변수 설정:');
console.log('JWT_SECRET=' + jwtSecret);

console.log('\n⚠️  주의사항:');
console.log('- 이 키를 안전한 곳에 보관하세요');
console.log('- 절대 코드에 하드코딩하지 마세요');
console.log('- Railway 환경변수에 설정하세요');
console.log('- 프로덕션에서는 더 복잡한 키를 사용하세요');

console.log('\n🚀 사용법:');
console.log('1. Railway 대시보드 → Variables 탭');
console.log('2. JWT_SECRET 키 추가');
console.log('3. 위의 키 값을 값으로 설정'); 