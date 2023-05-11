# 개발 관습

<br>

## 들여쓰기

---

<br>

들여쓰기 크기는 2칸이며 공백으로 채운다.

<br>

## 디렉터리 구조

---

<br>

이 프로젝트는 Next.js 기본 폴더 레이웃을 이용하며 기본 레이아웃에 추가적으로 디렉터리 구조를 설정한다.

```bash
├── components
    ├── ui
        ├── Button
            ├── index.jsx
            ├── Button.jsx
            ├── Button.module.css
    ├── icons : 아이콘 모음
        ├── AddIcon
            ├── index.jsx
            ├── AddIcon.jsx
            ├── AddIcon.module.css
    ├── auth
        ├── Auth
            ├── index.jsx
            ├── Auth.jsx
            ├── Auth.module.css
├── lib
    ├── hooks
        ├── useAuth.js
    ├── context
        ├── ModalsContext.js
├── pages
    ├── api
    ├── login
        ├── index.jsx
├── public
    ├── static
        ├── fonts
        ├── img
        ├── scss
├── store
    ├── modules
    ├── index.js
├── styles
# with browser open
yarn dev-open
```

- `components > ui` : 사이트 레이웃에 필요한 기본적인 구성요소가 들어있으며 내부에 UI 컴포넌트가 존재한다. UI 컴포넌트는 디렉터리이며 대문자로 표시한다.
  컴포넌트 안에서는 실제 컴포넌트와 css 조합으로 구성되고 index.jsx로 css가 결합된 컴포넌트를 내보낸다.<br>
  참고로 `*(index.jsx = Button.jsx + Button.module.css) 구조는 프론트 팀에서 진행하는 방향에 따라 변경될 수 있는 부분이다.`
- `components > icons` : 사이트에 필요한 아이콘들이 있으며 구조는 위에 설명한 `components > ui`와 같다.
- `components > auth` : 인증 페이지에 필요한 컴포넌트가 있다. 개발자가 필요에 의해 생성한 것이다. 이처럼 ui와 icons는 기본적인 컴포넌트라고 한다면 나머지는 특정 페이지의 필요에 의해서 생성된 것이다.
- `lib > hooks` : 사용자 정의 hook 모음이며 여기서 hook 안에 있는 파일들은 [ `use` + `이름` ] 파일명을 사용한다.
- `pages > api` : 내부 또는 외부 API를 연동하기 위한 API 모음.

<br>

## 컴포넌트 확장자

---

<br>

컴포넌트는 UI 측면이 강하므로 일반 js파일과 구별하기 위해서 jsx 확장자를 사용한다.

## JS 문법

---

<br>

typescript를 사용하면 많은 제약조건으로 인해 개발 속도가 저하되므로, typescript 를 사용하지 않는다.

단, 프로젝트 종료 이후 상황에 따라 typescript로 전환되는 것은 고려될 수 있다.

js 문법은 es6문법을 사용한다.

<br>

## API 모듈

---

<br>

API를 통신하는 모듈은 여러가지가 있다.

대표적으로 fetch, axios가 있는데 이 프로젝트에서는 axios를 사용한다.
