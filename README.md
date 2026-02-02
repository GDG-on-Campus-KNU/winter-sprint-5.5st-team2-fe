# GDG 5.5 Sprint 프로젝트 설정 가이드

이 문서는 프로젝트에 적용된 개발 환경 설정을 정리한 것입니다. 동일한 환경을 구성하고 싶을 때 참고하세요.

---

## 1. Prettier (코드 스타일 정리)

**역할:** 줄 바꿈, 띄어쓰기, 따옴표 등 코드 포맷팅을 자동으로 맞춰줍니다.

### 설치

```bash
pnpm add -D prettier
```

### 설정 파일: `.prettierrc`

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true
}
```

| 옵션 | 값 | 설명 |
|------|-----|------|
| `printWidth` | 80 | 한 줄 최대 80자 |
| `tabWidth` | 2 | 들여쓰기 2칸 |
| `singleQuote` | true | 작은따옴표 사용 |
| `trailingComma` | "all" | 가능한 곳에 trailing comma 추가 |
| `semi` | true | 세미콜론 사용 |

### 무시할 파일: `.prettierignore`

```
node_modules
dist
build
.next
coverage
*.min.js
package-lock.json
pnpm-lock.yaml
```

### 스크립트

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

---

## 2. ESLint (문법 및 코드 품질 검사)

**역할:** 사용하지 않는 변수, 잘못된 문법 등 잠재적 버그를 찾아줍니다.

### 설치

```bash
pnpm add -D eslint @eslint/js eslint-config-prettier
```

> **중요:** `eslint-config-prettier`는 Prettier와 충돌하는 ESLint 스타일 규칙을 끄기 위해 **반드시** 필요합니다. 스타일은 Prettier, 문법/로직은 ESLint가 담당합니다.

### 설정 파일: `eslint.config.js` (ESLint 9 Flat Config)

```javascript
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettierConfig, // 반드시 마지막에!
];
```

> `prettierConfig`는 **배열의 마지막**에 두어야 합니다. 그래야 Prettier와 겹치는 규칙이 비활성화됩니다.

### 스크립트

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

---

## 3. Vite (빌드 도구)

**역할:** 빠른 개발 서버와 프로덕션 빌드를 제공합니다.

### 설치

```bash
pnpm add -D vite
```

### 설정 파일: `vite.config.js`

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
});
```

### 프로젝트 구조

```
├── index.html          # 진입점 (Vite는 루트의 index.html을 사용)
├── src/
│   └── main.js         # 메인 JavaScript
└── vite.config.js
```

### `index.html` 예시

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GDG 5.5 Sprint</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 스크립트

```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```

---

## 4. package.json 전체 설정

```json
{
  "name": "gdg-5.5-sprint",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.4.0",
    "vite": "^6.0.0"
  }
}
```

> `"type": "module"`은 ESLint flat config(`eslint.config.js`)가 ESM을 사용하기 위해 필요합니다.

---

## 5. 한 번에 설치하기

새 프로젝트에서 위 설정을 적용하려면:

```bash
# 패키지 매니저: pnpm 사용
pnpm init

# 의존성 설치
pnpm add -D eslint @eslint/js eslint-config-prettier prettier vite
```

그 다음 `.prettierrc`, `.prettierignore`, `eslint.config.js`, `vite.config.js`, `index.html`, `src/main.js` 파일을 위 내용대로 생성하면 됩니다.

---

## 6. 자주 쓰는 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `pnpm run fix` | **ESLint + Prettier 한 번에 적용** (lint:fix + format) |
| `pnpm run dev` | 개발 서버 실행 |
| `pnpm run build` | 프로덕션 빌드 |
| `pnpm run preview` | 빌드 결과 미리보기 |
| `pnpm run lint` | ESLint 검사 |
| `pnpm run format:check` | Prettier 포맷 검사 |
