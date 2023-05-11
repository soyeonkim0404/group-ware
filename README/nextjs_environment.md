# nextjs 환경변수

<br>

nextjs는 .env 파일을 통해 환경변수를 사용할 수 있다.

환경변수 기본 파일은 .env이며 프로파일별로 확장해서 사용할 수 있다.

개발환경은 .env.development, 운영은 .env.production이다.

env.local은 이전 환경 변수들을 덮어쓰기한다.

그래서 .env.development, env.local이 같이 있고 두 파일에 선언된 변수가 같을 경우 최종적으로 env.local을 적용하게 된다.

nextjs에서 .env.local은 gitignore에 기본적으로 추가되어 있다.

그러므로 로컬에서 테스트할 경우 .env.local 파일을 생성하고 변수를 overwrite한다.

<br>

## 환경 변수 선언

---

환경 변수는 다음과 같은 형태로 선언한다.

```txt
API_HOST=https://groupware.pencilstudio.co.kr
```

<br>

그런데 nextjs는 서버와 클라이언트가 나누어져 있다.

그래서 위 형태로 사용하게 되면 서버는 사용할 수 있지만 클라이언트는 사용할 수 없게 된다.

그래서 이러한 문제를 해결하기 위해서 nextjs에서는 `NEXT_PUBLIC` prefix를 제공한다.

위 prefix가 붙은 변수는 client와 서버 둘다 사용할 수 있다.

```txt
NEXT_PUBLIC_API_HOST=https://groupware.pencilstudio.co.kr
```

<br>

## 변수의 사용

---

다음과 같이 process.env.{변수명}으로 접근하여 사용한다.

```js
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});
```
