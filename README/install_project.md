# 프로젝트 설치

<br>

현재 프로젝트는 gitlab에서 관리되고 있다.

주소는 <https://gitlab.emotion.co.kr/ep/groupware/groupware-ui.git> 이다.

이전에 nodejs를 설치할 경우 npm이 같이 설치되는데 이 프로젝트에서는 yarn을 통해 패키지를 관리하므로 yarn을 설치해준다.

```
> npm install -g yarn
```

yarn이 정상 설치되면 프로젝트 최상단에서 다음과 같이 yarn 설치 명령어를 실행해 준다.

```
> yarn
```

`yarn` 명령어는 `yarn install`과 같은 의미이다.

명령어를 실행하면 package.json에 명시된 의존 파일들을 다운로드한다.

의존파일 다운로드 후 다음과 같이 명령어로 프로젝트를 개발모드로 실행한다.

```
> yarn run dev

-- logs ----
yarn run v1.22.19
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from C:\Local-repos\groupware-web\.env.development
event - compiled client and server successfully in 826 ms (424 modules)
wait  - compiling...
event - compiled successfully in 58 ms (325 modules)
wait  - compiling...
event - compiled successfully in 24 ms (99 modules)
...
```

이제 localhost:3000으로 접속되면 사이트를 확인할 수 있다.
