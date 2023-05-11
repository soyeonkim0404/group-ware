# api 모듈 사용법

현 프로젝트에서는 jwt token 방식을 사용하고 있다.

그래서 api 요청시 header에 token을 설정해야 한다.

현재 `lib > api > http.js`에 요청시 header에 token을 설정할 수 있도록 구현하였고

http를 통해 api를 요청하도록 구성하였다.

api는 `lib > module.js`에 작성하도록 한다.

api는 `api + {method} + {사용자 정의 이름}` 형태로 작성한다.

```js
/**
 * 출퇴근 이력조회
 */
export const apiPostCommuteList = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/work_history/page',
    method: 'post',
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};
```
