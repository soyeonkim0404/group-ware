import http, { exportTokenByContext, httpNoInterceptors } from '@http';

/**
 * 함수 실행 시 병렬 처리 가능하도록 하는 함수
 *
 * @param {array|function} params - {name?, url, method, body?}로 구성된 json 또는 함수
 * @param {string} params.name return 시 json 의 키 값(유니크 해야 함)
 * @param {string} params.url api url | 필수값
 * @param {string} params.method api method | 필수값
 * @param {string} params.body api method 가 post 일 때 api body
 * @param {object} context serverside 의 context
 *
 * @returns {object} params 의 name 없으면 index 가 키 값
 */
export const parallelApi = async (params, context = null) => {
  const token = exportTokenByContext(context);

  const response = await httpNoInterceptors({
    url: '/api/v1/token/check',
    method: 'get',
    headers: { Authorization: token },
    withCredentials: true,
  });

  const newToken = response.headers.authorization
    ? 'bearer ' + response.headers.authorization
    : token;

  const nameList = params.map((item) => item.name);
  const isNonUniqueName = params.some(
    (item, i) => nameList.indexOf(item.name || i, i + 1) !== -1
  );
  if (isNonUniqueName) throw new Error('name 은 유니크 해야 합니다.');

  const promiseData = [];
  const returnData = {};

  params.forEach((param) => {
    if (typeof param === 'function') promiseData.push(param);
    else if (typeof param === 'object') {
      const httpConfig = {
        url: param.url,
        method: param.method,
        headers: { Authorization: newToken },
      };
      if (param.body) {
        httpConfig.body = param.body;
      }

      promiseData.push(http(httpConfig));
    }
  });

  return Promise.all(promiseData).then((result) => {
    result.forEach((data, i) => {
      returnData[params[i].name || i] = data.data;
    });
    return returnData;
  });
};

export const apiGetEmployees = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/user/page`,
    method: 'get',
    headers: {},
    params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const getCodesData = async (context, codes) => {
  const token = exportTokenByContext(context);
  let returnData = {};

  if (token) {
    return Promise.all(
      codes.map((code) => {
        const httpConfig = {
          url: `/api/v1/code/select?code=${code}`,
          method: 'get',
          headers: { Authorization: token },
        };
        return http(httpConfig);
      })
    ).then((result) => {
      result.forEach((data, i) => {
        returnData[codes[i]] = data.data;
      });
      return returnData;
    });
  }
};

// 임직원 관리 > 임직원 리스트 조회
export const getEmployeeALl = async (params, context = null) => {
  const httpConfig = {
    url: params
      ? `/api/v1/user/list?organization=${params.organization}`
      : `/api/v1/user/list`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const getEmployeeDetails = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/user/select?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const postNewEmployee = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/user/create',
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

export const updateNewEmployee = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/user/update',
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

export const postEditEmployee = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/user/update',
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

export const getEmployeeOptions = async (context = null) => {
  const apis = [
    {
      key: 'part',
      url: '/api/v1/organization/selectList',
    },
    {
      key: 'team',
      url: '/api/v1/organization/selectList/part',
    },
    {
      key: 'position',
      url: '/api/v1/code/select/position',
    },
    {
      key: 'grade',
      url: '/api/v1/code/select/grade',
    },
    {
      key: 'type',
      url: '/api/v1/code/select/member/type',
    },
    {
      key: 'status',
      url: '/api/v1/code/select/member/status',
    },
  ];
  const token = exportTokenByContext(context);
  let returnData = {};

  if (token) {
    return Promise.all(
      apis.map((api) => {
        const httpConfig = {
          url: api.url,
          method: 'get',
          headers: { Authorization: token },
        };
        return http(httpConfig);
      })
    ).then((datas) => {
      datas.forEach((data, i) => {
        returnData[apis[i].key] = data.data;
      });
      return returnData;
    });
  }
};

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

/**
 * 출퇴근 등록
 */
export const apiPostNewCommute = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/work_history/create',
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

/**
 * 출근
 */
export const apiPostWorkOn = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/work_history/create/on',
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

/**
 * 퇴근
 */
export const apiPostWorkOff = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/work_history/create/off',
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

/**
 * 출퇴근 상세
 */
export const apiGetCommuteView = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/work_history/select`,
    method: 'get',
    params,
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

/**
 * 출퇴근 수정
 */
export const apiPostUpdateComute = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/work_history/update',
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

export const apiGetDepartment = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/organization/selectList`,
    method: 'get',
    headers: {},
  };
  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

export const apiPostCreateDepartment = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/organization/create',
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

export const getPartList = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/organization/selectList/part`,
    method: 'get',
    headers: {},
  };
  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

export const apiPostModifyDepartmentList = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/organization/updateAll',
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

export const apiPostModifyDepartment = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/organization/update',
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

export const apiDeleteDepartment = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/organization/delete',
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

/**
 * 임시 파일 업로드
 */
export const apiPostUploadTempFile = async (formData, context = null) => {
  const httpConfig = {
    url: '/api/v1/file/create/temp',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

/**
 * 게시판 이미지 업로드
 */
export const apiPostMDImageFile = async (formData, context = null) => {
  const httpConfig = {
    url: '/api/v1/file/create/mdImage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

/**
 * 프로파일 가져오기
 */
export const apiGetProfile = async (context = null) => {
  const httpConfig = {
    url: '/api/v1/user/select/profile',
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }
  const res = await http(httpConfig);
  return res;
};

export const getPersonalApproval = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    page: params.page,
    size: params.size || 10,
    approvalType: params.approvalType || '',
    approvalStatus: params.approvalStatus || '',
    approvalDetailType: params.approvalDetailType || '',
  });

  const httpConfig = {
    url: `/api/v1/approval/page?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalConfirmPage = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    page: params.page,
    size: params.size || 10,
    approvalType: params.approvalType || '',
    approvalStatus: params.approvalStatus || '',
    approvalDetailType: params.approvalDetailType || '',
    searchValue: params.searchValue || '',
  });

  const httpConfig = {
    url: `/api/v1/mapproval/page?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalConfirm = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/mapproval/update/confirm`,
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

export const apiApprovalRewrite = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/mapproval/update/rewrite`,
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

export const getApprovalDetails = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    id: params.id,
  });

  const httpConfig = {
    url: `/api/v1/approval/select?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const getEmployeeList = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    organization: params.organization || '',
    position: params.position || '',
    grade: params.grade || '',
    type: params.type || '',
    status: params.status || '',
  });

  const httpConfig = {
    url: `/api/v1/user/list?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const updateVacation = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/vacation/create`,
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

export const getProjectOptions = async (context = null) => {
  const apis = [
    {
      key: 'type',
      url: '/api/v1/code/select/project/type',
    },
    {
      key: 'role',
      url: '/api/v1/code/select/project/role',
    },
    {
      key: 'grade',
      url: '/api/v1/code/select/project/grade',
    },
    {
      key: 'client',
      url: '/api/v1/client/list',
    },
  ];
  const token = exportTokenByContext(context);

  let returnData = {};
  if (token) {
    return Promise.all(
      apis.map((api) => {
        const httpConfig = {
          url: api.url,
          method: 'get',
          headers: { Authorization: token },
        };
        return http(httpConfig);
      })
    ).then((datas) => {
      datas.forEach((data, i) => {
        returnData[apis[i].key] = data.data;
      });
      return returnData;
    });
  }
};

export const postProjectRegister = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/project/create',
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

export const postProjectUpdate = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/project/update',
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

export const getProject = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/project/page`,
    method: 'get',
    headers: {},
    params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiProjectDelete = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/project/delete',
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

export const apiCheckApproval = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/check`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalVacation = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/vacation`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalEtcLetter = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/letter/etc`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalTaxLetter = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/letter/tax`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalCorporationLetter = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/letter/corporation`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalIndividualPayment = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/payment/individual`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalPayment = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/create/payment`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const apiApprovalUpdate = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/approval/update`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

export const getProjectDetails = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/project/select?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiProjectAvailableSelect = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/project/check/select?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiProjectAvailableEdit = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/project/check/edit?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const getProjectByUser = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/project/select/byUser?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiLogin = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/login`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const getBoardOptions = async (context = null) => {
  const apis = [
    {
      key: 'type',
      url: '/api/v1/code/select/board/type',
    },
  ];
  const token = exportTokenByContext(context);
  let returnData = {};
  if (token) {
    return Promise.all(
      apis.map((api) => {
        const httpConfig = {
          url: api.url,
          method: 'get',
          headers: { Authorization: token },
        };
        return http(httpConfig);
      })
    ).then((datas) => {
      datas.forEach((data, i) => {
        returnData[apis[i].key] = data.data;
      });
      return returnData;
    });
  }
};

export const apiGetMenuList = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/menu/select`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetAuthList = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/auth/select`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiAppendApprovalLine = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/mapproval/create/addLine`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetBoardInfo = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    name: params.name,
  });

  const httpConfig = {
    url: `/api/v1/board/select/boardInfo?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetPostPage = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    page: params.page,
    size: params.size || 10,
    boardId: params.boardId,
    searchOption: params.searchOption,
    searchValue: params.searchValue,
  });

  const httpConfig = {
    url: `/api/v1/board/page?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiEditPost = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/update`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiRegisterPost = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/create`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiDeletePost = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/delete`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetBoardPost = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    id: params.id,
  });

  const httpConfig = {
    url: `/api/v1/board/select?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiSelectComment = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    id: params.id,
  });

  const httpConfig = {
    url: `/api/v1/board/select/comment?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiRegisterComment = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/create/comment`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiUpdateComment = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/update/comment`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiDeleteComment = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/board/delete/comment`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*출퇴근 체크*/
export const apiGetCommute = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/work_history/check`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*대시보드*/
export const apiGetDashboard = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/dashboard/select`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*마이페이지*/
export const apiGetMyInfo = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/select/info`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetMyCommute = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/select/workHistory?year=${params.year}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetMyApproval = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/select/approval`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetMyApprovalDetail = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/select/approval/detail?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiUpdateMypage = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/update/info`,
    method: 'post',
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiUpdatePassword = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/myPage/update/password`,
    method: 'post',
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*나의 연차*/
export const apiGetMyHoliday = async (context = null) => {
  const httpConfig = {
    url: `/api/v1/vacation/select/usage`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*고객사*/
export const apiRegisterClient = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/client/create`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiEditClient = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/client/update`,
    method: 'post',
    headers: {},
    data: params,
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetClientDetail = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/client/select?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiGetClientList = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    page: params.page,
    size: params.size || 10,
    searchOption: params.searchOption,
    searchValue: params.searchValue,
  });

  const httpConfig = {
    url: `/api/v1/client/page?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res;
};

/*전사 캘린더*/
export const apiGetCalendar = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/calendar/select?year=${params.year}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*나의 연차*/
export const apiGetVacationList = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    year: params.year,
    user: params.user,
  });

  const httpConfig = {
    url: `/api/v1/vacation/select/list?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

/*5층 회의실*/
export const apiGetMeetingRoom = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/meetingRoom/select?year=${params.year}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiPostMeetingRoomCreate = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/meetingRoom/create',
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

export const apiGetMeetingRoomInfo = async (params, context = null) => {
  const httpConfig = {
    url: `/api/v1/meetingRoom/select/meetingRoomInfo?id=${params.id}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};

export const apiPostMeetingRoomUpdate = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/meetingRoom/update',
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

export const apiPostMeetingRoomDelete = async (params, context = null) => {
  const httpConfig = {
    url: '/api/v1/meetingRoom/delete',
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

export const apiGetVacationExcel = async (params, context = null) => {
  const queryParam = new URLSearchParams({
    year: params.year || '',
  });

  const httpConfig = {
    url: `/api/v1/vacation/excel?${queryParam.toString()}`,
    method: 'get',
    headers: {},
  };

  const token = exportTokenByContext(context);
  if (token) {
    httpConfig.headers['Authorization'] = token;
  }

  const res = await http(httpConfig);
  return res.data;
};
