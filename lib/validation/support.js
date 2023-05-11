/** Byte 계산 */
export const calculateByte = (s) => {
  if (typeof s !== 'string') throw new Error('문자열 형태가 아닙니다.');

  const encode = new TextEncoder().encode(s);

  return encode.byteLength;
};

/** Invalid API 응답 message 중 첫번째 값만 리턴 */
export const getFirstInvalidMessageToString = (o) => {
  if (typeof o === 'string') return o;
  else if (typeof o === 'undefined') return '';
  else if (Array.isArray(o)) {
    return getFirstInvalidMessageToString(o[0]);
  } else if (typeof o === 'object') {
    const keys = Object.getOwnPropertyNames(o);

    return getFirstInvalidMessageToString(o[keys[0]]);
  } else return '';
};

/** Invalid API 응답 message 를 문자열로 리턴 */
export const getInvalidMessageToString = (o) => {
  let result = '';

  if (typeof o === 'string') return ' -' + o;
  else if (typeof o === 'undefined') return '-';
  else if (Array.isArray(o)) {
    o.forEach((item) => (result += getInvalidMessageToString(item)));
    return `[${result.trim()}]`;
  } else if (typeof o === 'object') {
    Object.getOwnPropertyNames(o).forEach(
      (key) => (result += key + ': ' + getInvalidMessageToString(o[key]) + '\n')
    );
    return result.trim();
  }

  return result.trim();
};

export const sliceByByte = (s, byte) => {
  let b, i, c;

  for (b = i = 0; (c = s.charCodeAt(i)); ) {
    b += c >> 7 ? 2 : 1;
    if (b > byte) break;
    i++;
  }

  return s.substring(0, i);
};
