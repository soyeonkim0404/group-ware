# import 별칭

<br>

프로젝트 내에서 상대경로로 export 모듈을 가져오는 것은 불편함이 있다.

그래서 `root > jsconfig.json`에 절대경로와 연결된 별칭을 설정해 놓았다.

필요에 따라 경로를 추가해 사용하도록 한다.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["components/*"],
      "@layouts/*": ["layouts/*"],
      "@lib/*": ["lib/*"],
      "@store/*": ["store/*"],
      "@styles/*": ["styles/*"]
    }
  }
}
```

다음은 별칭을 이용하여 모듈을 가져오는 방법이다.

```js
import Button from '@components/ui/Button';
import Button from '@lib/hooks/useAuth';
```
