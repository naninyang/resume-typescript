- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- 본 프로젝트는 개인용으로 사용하기 위해 만들어진 프로젝트입니다.
- 본 프로젝트는 https://github.com/naninyang/resume 저장소를 `TypeScript`로 변환한 프로젝트입니다.
- TypeScript로 변환하면서 발견된 버그들을 fix 한 버전이기 때문에 원본보다 버그가 덜합니다. (...)
- `CHAT-GPT`의 `GPT-4` 모델의 도움을 받아 프로그래밍 되었습니다.
- 이력서에 필요한 데이터를 관리하며, 데이터들을 통해 프린트 또는 PDF로 만들어서 관리할 수 있습니다.
- `Next.js`로 만들어진 프로젝트이기 때문에 `Node`, `React`, `Next.js`등의 환경에 대해 이해도가 있어야 사용 가능합니다.

## Getting Started

```bash
git clone git@github.com:naninyang/resume-typescript.git
cd resume-typescript
md public/uploads
yarn auth
```

터미널 화면에 뜨는 `NEXT_PUBLIC_TOKEN=`, `NEXT_PUBLIC_JWT_SECRET=` 두개 값을 복사합니다.

```bash
cp .env.next .env
mv .env
vi .env
```

복사해둔 값을 붙여넣습니다. `:`를 입력 후 `wq!`를 입력하고 `enter`키를 입력합니다. 그 다음,

```bash
npx prisma migrate dev
yarn dev
```

를 입력하여 Next.js 프로젝트를 실행합니다. 만약, 3000 Port를 사용 중이거나 불안정하다면 PORT를 입력할 수도 있습니다.

이를테면

```bash
PORT=3002 yarn dev
```

## 사용법

1. `/manages/sign-up` 화면으로 이동하여 회원가입 합니다.
1. 회원가입이 완료되면 자동으로 `/manages/pass` 화면으로 이동합니다. 로그인 하세요.
1. 각각 필요한 내용들을 채워 넣습니다.
1. 모두 저장하고 상단 메뉴에서 `이력서보기`를 눌러 이력서 화면으로 이동합니다.
1. 이력서보기 화면에서는 저장된 내용들 모두 보여줍니다.
1. 상단에 `프린트 화면으로 이동`을 누르면 프린트 할 수 있는 프린트 전용 화면으로 이동됩니다.
1. 프린트 전용 화면에서는 실제 프린트 했을 때 뜨는 내용들이기 때문에 공개하지 않기로 한 내용들은 공개되지 않습니다.
1. 프린트 전용 화면에서의 `자기소개서`는 프로필 항목에서 이름을 공개하지 않으면 `자기소개서`의 `공개여부`가 체크되어 있어도 공개되지 않습니다.

## TO-DO

1. 아이디 찾기
1. 비밀번호 찾기

## Prisma

본 프로젝트는 `Prisma`를 이용하여 DB를 관리합니다. 그리고 `SQLite3`를 사용합니다.

개인용으로 사용하는 프로젝트이기 때문에 SQLite3를 사용했습니다.

## Security & Authentication

보안과 인증은 Hash password, bcrypt, jsonwebtoken, JWT, token 등을 사용해서 어느정도 신경은 썼지만 보안과 관련된 지식이 없는 상태로 개발했기 때문에 production 환경으로 deploy하여 사용하는 것은 추천하지 않습니다.

## CAUTION

이 프로젝트를 사용함에 있어서 production 환경에서 사용시 보안이나 인증에 문제가 생기거나 또는 개인정보와 관련한 문제가 생겼을 시, naninyang은 어떠한 책임도 지지 않습니다.

이 프로젝트는 보안에 있어서 문제가 없음을 보장하지 않습니다.
