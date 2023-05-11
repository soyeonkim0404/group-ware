# prettier 사용법

<br>

nextJs는 기본적으로 esLint를 사용한다.

esLint는 쉽게 설명하여 코드의 문법이나 기타 표현 오류를 검사하는 툴이다.

이 esLint에는 다양한 플러그인을 설치할 수 있는데 그중에서 이 프로젝트에서는 `prettier`를 추가하여 사용하고 있으며

이를 통해 문법 검증을 할 수 있다.

`yarn install`을 하면 패키지 설정에 따라 prettier가 설치된다.

따라서 명령어를 통해 문법 검사를 수행하면 된다.

명령어는 다음과 같다.

참고로 뒤에 점은 폴더의 경로를 말한다. 즉 현재 위치를 기준으로 하위 폴더를 검사함을 의미한다.

만약 특정 파일 또는 폴더를 대상으로 검사하고 싶을 경우 해당 경로를 입력한다.

```
> npx prettier --check .

== print ====
Checking formatting...
[warn] pages\login\index.jsx
[warn] README.md
[warn] Code style issues found in 2 files. Forgot to run Prettier?
...
```

만약 검사에서 제외하고 싶은 파일 또는 폴더가 있을 경우 `root > .prettierignore` 파일에 추가한다.

<br>

prettier에 설정한 포맷으로 고칠경우 다음과 같은 명령어를 사용한다.

```
> npx prettier --write .
```
