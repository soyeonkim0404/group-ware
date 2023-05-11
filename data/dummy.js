import React from 'react';

import * as ReactIcons from 'react-icons/md';
/*
 * 임시용 사이브바 메뉴
 * 추후에 서버에서 메뉴를 받아와야 함
 * 지금은 테스트니까 하드코딩함
 * */

const getIconComponent = (iconName) => {
  return React.createElement(ReactIcons[iconName] || ReactIcons['MdArticle'], null, null);
};

/** 동적으로 메뉴 관리를 위한 삭제 예정 */
export const pageLink = {
  // links: [
  //   {
  //     name: '로그인',
  //     path: '/login',
  //     icon: <MdArticle />,
  //   },
  //   {
  //     name: '임직원관리',
  //     path: '/employee',
  //     icon: getIconComponent('MdOutlineAccountBox'),
  //     subMenus: [
  //       {
  //         name: '목록',
  //         path: '/employee',
  //         icon: <MdArticle />,
  //       },
  //       {
  //         name: '상세',
  //         path: '/employee/view?id=1',
  //         icon: <MdArticle />,
  //       },
  //       {
  //         name: '등록',
  //         path: '/employee/register',
  //         icon: <MdArticle />,
  //       },
  //       {
  //         name: '수정',
  //         path: '/employee/edit?id=1',
  //         icon: <MdArticle />,
  //       },
  //       {
  //         name: '연차 일괄 부여',
  //         path: '/employee/vacation/grantAll',
  //         icon: <MdArticle />,
  //       },
  //     ],
  //   },
  //   {
  //     name: '조직관리',
  //     path: '/department',
  //     icon: getIconComponent('MdArticle'),
  //   },
  //   {
  //     name: '프로젝트 관리',
  //     path: '/management',
  //     icon: getIconComponent('MdArticle'),
  //     subMenus: [
  //       {
  //         name: '목록',
  //         path: '/management',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //       {
  //         name: '등록',
  //         path: '/management/register',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //     ],
  //   },
  //   {
  //     name: '출퇴근 관리',
  //     path: '/commute',
  //     icon: getIconComponent('MdArticle'),
  //   },
  //   {
  //     name: '결재관리',
  //     path: '/approval/expense',
  //     icon: getIconComponent('MdArticle'),
  //     subMenus: [
  //       {
  //         name: '결재 내역',
  //         path: '/approval',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //       {
  //         name: '결재 대기',
  //         path: '/approval/process',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //       {
  //         name: '결재 확인',
  //         path: '/approval/confirm',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //       {
  //         name: '결재 신청',
  //         path: '/approval/expense',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //       {
  //         name: '연차 신청',
  //         path: '/approval/leave',
  //         icon: getIconComponent('MdArticle'),
  //       },
  //     ],
  //   },
  //   {
  //     name: '게시판',
  //     path: '/board',
  //     icon: getIconComponent('MdArticle'),
  //     subMenus: [
  //         {
  //           name: '목록',
  //           path: '/board',
  //           icon: getIconComponent('MdArticle'),
  //         },
  //         {
  //           name: '등록',
  //           path: '/board/register',
  //           icon: getIconComponent('MdArticle'),
  //         },
  //         {
  //           name: '상세',
  //           path: '/board/view',
  //           icon: getIconComponent('MdArticle'),
  //         },
  //         {
  //           name: '수정',
  //           path: '/board/edit',
  //           icon: getIconComponent('MdArticle'),
  //         },
  //       ],
  //   },
  //   {
  //     name: '가이드 페이지',
  //     path: '/guide',
  //     icon: getIconComponent('MdArticle'),
  //   },
  // ],
};

export const naviLink = [
  {
    name: 'path',
    uri: '/path',
    icon: 'MdFindInPage',
  },
  {
    name: 'modals-guide',
    uri: '/guide/modals-guide',
    icon: 'MdLayers',
  },
  {
    name: 'layout',
    uri: '/',
    icon: 'MdSubject',
  },
  {
    name: 'loading',
    uri: '/guide/loadings',
    icon: 'MdRotateLeft',
  },
  {
    name: 'button',
    uri: '/guide/buttons',
    icon: 'MdAspectRatio',
  },
  {
    name: 'input',
    uri: '/guide/inputs',
    icon: 'MdTextRotationNone',
  },
  {
    name: 'checkbox',
    uri: '/guide/input-checkbox',
    icon: 'MdCheckBox',
  },
  {
    name: 'checkbox 도은',
    uri: '/guide/input-checkbox2',
    icon: 'MdCheckBox',
  },
  {
    name: 'radio',
    uri: '/guide/input-radio',
    icon: 'MdRadioButtonChecked',
  },
  {
    name: 'textarea',
    uri: '/guide/form-textarea',
    icon: 'MdTextFields',
  },
  {
    name: 'markdown-editor',
    uri: '/guide/markdown-editor',
    icon: 'MdTextFields',
  },
  {
    name: 'toast-editor',
    uri: '/guide/toasteditor-ui',
    icon: 'MdTextFields',
  },
  {
    name: 'select',
    uri: '/guide/selects',
    icon: 'MdOutlineCrop169',
  },
  {
    name: 'table',
    uri: '/guide/tables',
    icon: 'MdGridOn',
  },
  {
    name: 'calendars',
    uri: '/guide/calendars',
    icon: 'MdOutlineCalendarToday',
  },
  {
    name: 'file-upload',
    uri: '/guide/form-file',
    icon: 'MdOutlineFilePresent',
  },
  {
    name: 'tooltip',
    uri: '/guide/tooltips',
    icon: 'MdOutlineTextsms',
  },
  {
    name: 'pagination',
    uri: '/guide/paginations',
    icon: 'MdOutlineViewWeek',
  },
  {
    name: 'text-list',
    uri: '/guide/text-lists',
    icon: 'MdFormatListBulleted',
  },
  {
    name: 'flag',
    uri: '/guide/flags',
    icon: 'MdFlag',
  },
  {
    name: 'popover util',
    uri: '/guide/popover-utils',
    icon: 'MdMoreVert',
  },
  {
    name: 'tabs',
    uri: '/guide/tabs',
    icon: 'MdTab',
  },
  {
    name: 'toast popup',
    uri: '/guide/toasts',
    icon: 'MdOutlineSms',
  },
  {
    name: 'form view',
    uri: '/guide/form-view',
    icon: 'MdFormatListBulleted',
  },
  {
    name: 'accordion',
    uri: '/guide/accordions',
    icon: 'MdHorizontalSplit',
  },
  {
    name: 'dropdown',
    uri: '/guide/dropdown-ui',
    icon: 'MdMenu',
  },
  {
    name: 'datepicker',
    uri: '/guide/datepickers',
    icon: 'MdOutlineCalendarToday',
  },
];

export const selectOption = [
  { value: 'chocolate', label: 'Chocolate', code: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry', code: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla', code: 'Vanilla' },
];

export const inputOption = [
  { id: 'value01', label: '김소연' },
  { id: 'value02', label: '김도은', disabled: true },
  { id: 'value03', label: '이수현' },
];

export const inputOption2 = [
  { id: 'v1', label: '기획' },
  { id: 'v2', label: '디자인' },
  { id: 'v3', label: '프론트' },
  { id: 'v4', label: '백엔드' },
];

export const inputOption3 = [
  { id: 'v5', label: '월요일', disabled: true },
  { id: 'v6', label: '화요일', checked: true },
  { id: 'v7', label: '수요일' },
  { id: 'v8', label: '목요일' },
];

export const checkOption = {
  name: 'checkFruits',
  checked: ['chk-orange'],
  list: [
    { id: 'chk-orange', name: '오렌지', checked: true },
    { id: 'chk-apple', name: '사과' },
    { id: 'chk-strawberry', name: '딸기', disabled: true },
    { id: 'chk-peach', name: '복숭아' },
  ],
};

export const checkOption2 = {
  name: 'checkUserName',
  checked: ['user01'],
  list: [
    { id: 'user01', name: '박보검', checked: true },
    { id: 'user02', name: '차은우' },
    { id: 'user03', name: '서강준' },
    { id: 'user04', name: '송강' },
  ],
};

export const checkOption3 = {
  name: 'checkBTS',
  checked: ['member01'],
  list: [
    { id: 'member01', name: '진' },
    { id: 'member02', name: '지민', checked: true },
    { id: 'member03', name: '뷰', disabled: true },
    { id: 'member04', name: '정국' },
  ],
};

export const tableData = {
  tableHeads: ['Name', 'ISO Code', 'Population', 'Date', 'ISO Code', 'Time'],
  columns: [
    {
      name: '인도',
      isoCode: 'IN',
      population: '1324171354',
      data1: '2022-11-02',
      data2: 'IN',
      data3: '09:02',
    },
    {
      name: '중국',
      isoCode: 'CN',
      population: '1403500365',
      data1: '2022-11-02',
      data2: 'IN',
      data3: '09:02',
    },
    {
      name: '이탈리아',
      isoCode: 'IT',
      population: '60483973',
      data1: '2022-11-02',
      data2: 'IN',
      data3: '09:02',
    },
    {
      name: '미국',
      isoCode: 'US',
      population: '327167434',
      data1: '2022-11-02',
      data2: 'IN',
      data3: '09:02',
    },
  ],
};

export const listData = {
  tableHeads: ['Name', 'ISO Code', 'Population', 'Date', 'ISO Code', 'Time'],
  columns: [
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
    },
    {
      name: 'Madame Uppercut',
      age: 39,
      secretIdentity: 'Jane Wilson',
      powers: ['Million tonne punch', 'Damage resistance', 'Superhuman reflexes'],
    },
    {
      name: 'Eternal Flame',
      age: 1000000,
      secretIdentity: 'Unknown',
      powers: [
        'Immortality',
        'Heat Immunity',
        'Inferno',
        'Teleportation',
        'Interdimensional travel',
      ],
    },
  ],
};

export const tabData = [
  {
    tab: 'react',
    content:
      '컴퓨팅에서 리액트는 자바스크립트 라이브러리의 하나로서 사용자 인터페이스를 만들기 위해 사용된다. 페이스북과 개별 개발자 및 기업들 공동체에 의해 유지보수된다. 리액트는 싱글 페이지나 모바일 애플리케이션의 개발 시 토대로 사용될 수 있다.',
  },
  {
    tab: 'Node.js',
    content:
      'Node.js는 확장성 있는 네트워크 애플리케이션 개발에 사용되는 소프트웨어 플랫폼이다. 작성 언어로 자바스크립트를 활용하며 Non-blocking I/O와 단일 스레드 이벤트 루프를 통한 높은 처리 성능을 가지고 있다',
  },
  {
    tab: 'javascript',
    content:
      '자바스크립트는 객체 기반의 스크립트 프로그래밍 언어이다. 이 언어는 웹 브라우저 내에서 주로 사용하며, 다른 응용 프로그램의 내장 객체에도 접근할 수 있는 기능을 가지고 있다. 또한 Node.js와 같은 런타임 환경과 같이 서버 사이드 네트워크 프로그래밍에도 사용되고 있다.',
  },
];

export const employeeData = {
  tableHeads: ['#', '사진', '이름', '직급', '직책', '부서', '팀'],
  columns: [
    {
      name: {
        label: '이름',
        value: '최복규',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '1',
        valid: true,
      },
      state: {
        id: 'STATE_1',
        label: '상태',
        value: '재직중',
        valid: true,
      },
      department: {
        id: 'DIRECTORS',
        label: '부문',
        value: '경영진',
        valid: true,
      },
      team: {
        id: '',
        label: '',
        value: '',
        valid: true,
      },
      position: {
        id: 'POS_8',
        label: '직급',
        value: '대표이사',
        valid: true,
      },
      duty: {
        id: 'DT_6',
        label: '직책',
        value: '대표이사',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2011-01-24',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '1',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/profile.jpg',
        valid: true,
      },
    },
    {
      name: {
        label: '이름',
        value: '김영선',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '2',
        valid: true,
      },
      state: {
        id: 'STATE_2',
        label: '상태',
        value: '휴직중',
        valid: true,
      },
      department: {
        id: 'DEP_MANAGEMENT',
        label: '부문',
        value: '경영전략본부',
        valid: true,
      },
      team: {
        id: '',
        label: '',
        value: '',
        valid: true,
      },
      position: {
        id: 'POS_1',
        label: '직급',
        value: '팀원',
        valid: true,
      },
      duty: {
        id: 'DT_1',
        label: '직책',
        value: '팀원',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2020-05-08',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '2',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/profile.jpg',
        valid: true,
      },
    },
    {
      name: {
        label: '이름',
        value: '박래섭',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '3',
        valid: true,
      },
      state: {
        id: 'STATE_1',
        label: '상태',
        value: '재직중',
        valid: true,
      },
      department: {
        id: 'DEP_BT2',
        label: '부문',
        value: 'BT2',
        valid: true,
      },
      team: {
        id: 'TEAM_CT2',
        label: '본부',
        value: 'CT2',
        valid: true,
      },
      position: {
        id: 'POS_4',
        label: '직급',
        value: '책임리더',
        valid: true,
      },
      duty: {
        id: 'DT_2',
        label: '직책',
        value: '파트장',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2020-11-11',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '3',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/profile.jpg',
        valid: true,
      },
    },
    {
      name: {
        label: '이름',
        value: '김소연',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '4',
        valid: true,
      },
      state: {
        id: 'STATE_2',
        label: '상태',
        value: '휴직중',
        valid: true,
      },
      department: {
        id: 'DEP_BT2',
        label: '부문',
        value: 'BT2',
        valid: true,
      },
      team: {
        id: 'TEAM_CT2',
        label: '본부',
        value: 'CT2',
        valid: true,
      },
      position: {
        id: 'POS_2',
        label: '직급',
        value: '리더',
        valid: true,
      },
      duty: {
        id: 'DT_ETC',
        label: '직책',
        value: '가오리',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2020-06-23',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '4',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/cute.png',
        valid: true,
      },
    },
    {
      name: {
        label: '이름',
        value: '김도은',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '5',
        valid: true,
      },
      state: {
        id: 'STATE_3',
        label: '상태',
        value: '퇴사',
        valid: true,
      },
      department: {
        id: 'DEP_BT2',
        label: '부문',
        value: 'BT2',
        valid: true,
      },
      team: {
        id: 'TEAM_CT2',
        label: '본부',
        value: 'CT2',
        valid: true,
      },
      position: {
        id: 'POS_1',
        label: '직급',
        value: '팀원',
        valid: true,
      },
      duty: {
        id: 'DT_1',
        label: '직책',
        value: '팀원',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2020-06-23',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '5',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/profile.jpg',
        valid: true,
      },
    },
    {
      name: {
        label: '이름',
        value: '박민영',
        valid: true,
      },
      id: {
        label: '사원번호',
        value: '6',
        valid: true,
      },
      state: {
        id: 'STATE_1',
        label: '상태',
        value: '재직중',
        valid: true,
      },
      department: {
        id: 'DEP_BT1',
        label: '부문',
        value: 'BT1',
        valid: true,
      },
      team: {
        id: 'TEAM_CT1',
        label: '본부',
        value: 'CT1',
        valid: true,
      },
      position: {
        id: 'POS_1',
        label: '직급',
        value: '팀원',
        valid: true,
      },
      duty: {
        id: 'DT_1',
        label: '직책',
        value: '팀원',
        valid: true,
      },
      cell: {
        label: '휴대폰',
        value: '01012341234',
        valid: true,
      },
      email: {
        label: '이메일',
        value: 'emotion@emotion.co.kr',
        valid: true,
      },
      date: {
        label: '입사일',
        value: '2021-06-23',
        valid: true,
      },
      emergency: {
        label: '비상연락망',
        value: '01012345678',
        valid: true,
      },
      extension: {
        label: '내선번호',
        value: '6',
        valid: true,
      },
      photo: {
        label: '사진',
        value: '/static/img/profile.jpg',
        valid: true,
      },
    },
  ],
};
export const currentStateData = [
  {
    id: 'STATE_1',
    value: '재직중',
    label: '재직중',
  },
  {
    id: 'STATE_2',
    value: '휴직중',
    label: '휴직중',
  },
  {
    id: 'STATE_3',
    value: '퇴사',
    label: '퇴사',
  },
];

export const departmentData = [
  {
    id: 'DEP_BT1',
    value: 'BT1',
    label: 'BT1',
    teams: [
      { id: 'TEAM_CP1', value: 'CP1', label: 'CP1' },
      { id: 'TEAM_CD1', value: 'CD1', label: 'CD1' },
      { id: 'TEAM_CT1', value: 'CT1', label: 'CT1' },
    ],
  },
  {
    id: 'DEP_BT2',
    value: 'BT2',
    label: 'BT2',
    teams: [
      { id: 'TEAM_CP2', value: 'CP2', label: 'CP2' },
      { id: 'TEAM_CD2', value: 'CD2', label: 'CD2' },
      { id: 'TEAM_CT2', value: 'CT2', label: 'CT2' },
    ],
  },
  {
    id: 'DEP_XT',
    value: 'XT',
    label: 'XT',
    teams: [{ id: 'TEAM_CX', value: 'CX', label: 'CX' }],
  },
  {
    id: 'DEP_MANAGEMENT',
    value: '경영전략본부',
    label: '경영전략본부',
    teams: [],
  },
  {
    id: 'DIRECTORS',
    value: '경영진',
    label: '경영진',
    teams: [],
  },
];

export const positionData = [
  {
    id: 'POS_1',
    value: '팀원',
    label: '팀원',
  },
  {
    id: 'POS_2',
    value: '리더',
    label: '리더',
  },
  {
    id: 'POS_3',
    value: '선임리더',
    label: '선임리더',
  },
  {
    id: 'POS_4',
    value: '책임리더',
    label: '책임리더',
  },
  {
    id: 'POS_5',
    value: '본부장',
    label: '본부장',
  },
  {
    id: 'POS_6',
    value: '부문장',
    label: '부문장',
  },
  {
    id: 'POS_7',
    value: '상무이사',
    label: '상무이사',
  },
  {
    id: 'POS_8',
    value: '대표이사',
    label: '대표이사',
  },
  {
    id: 'POS_9',
    value: 'PD',
    label: 'PD',
  },
];

export const dutyData = [
  {
    id: 'DT_1',
    value: '팀원',
    label: '팀원',
  },
  {
    id: 'DT_2',
    value: '파트장',
    label: '파트장',
  },
  {
    id: 'DT_3',
    value: '본부장',
    label: '본부장',
  },
  {
    id: 'DT_4',
    value: '부문장',
    label: '부문장',
  },
  {
    id: 'DT_5',
    value: '상무이사',
    label: '상무이사',
  },
  {
    id: 'DT_6',
    value: '대표이사',
    label: '대표이사',
  },
  {
    id: 'DT_7',
    value: 'PD',
    label: 'PD',
  },
  {
    id: 'DT_ETC',
    value: '가오리',
    label: '가오리',
  },
];
export const managementData = {
  tableHeads: ['타입', '프로젝트명', '기간', 'PM', '클라이언트', ''],
  columns: [
    {
      id: {
        label: 'id',
        value: '1',
        valid: true,
      },
      type: {
        label: '타입',
        value: '파견',
        valid: true,
      },
      title: {
        label: '프로젝트명',
        value: '미래에셋대우 온라인 채널 디자인 운영',
        valid: true,
      },
      date: {
        label: '기간',
        value: '2011-01-24 ~ 2011-01-24',
        valid: true,
      },
      pm: {
        label: 'PM',
        value: '김소연',
        valid: true,
      },
      clients: {
        label: '클라이언트',
        value: 'Clients',
        valid: true,
      },
      /* setting: {
       label: 'setting',
       value: 'setting',
       valid: true,
     },*/
    },
    {
      id: {
        label: 'id',
        value: '2',
        valid: true,
      },
      type: {
        label: '타입',
        value: '파견',
        valid: true,
      },
      title: {
        label: '프로젝트명',
        value: '미래에셋대우 온라인 채널 디자인 운영',
        valid: true,
      },
      date: {
        label: '기간',
        value: '2011-01-24 ~ 2011-01-24',
        valid: true,
      },
      pm: {
        label: 'PM',
        value: '박래섭',
        valid: true,
      },
      clients: {
        label: '클라이언트',
        value: 'Clients',
        valid: true,
      },
      /* setting: {
       label: 'setting',
       value: 'setting',
       valid: true,
     },*/
    },
  ],
};

export const dropdownMenu = [
  {
    path: '/',
    label: 'DropDownMenu1',
    value: '1',
    child: [
      {
        path: '/',
        label: 'DepthMenu1-01',
        value: '1-1',
      },
      {
        path: '/',
        label: 'DepthMenu1-02',
        value: '1-2',
      },
      {
        path: '/',
        label: 'DepthMenu1-03',
        value: '1-3',
      },
    ],
  },
  {
    path: '/',
    label: 'DropDownMenu2',
    value: '2',
    child: [
      {
        path: '/',
        label: 'DepthMenu2-01',
        value: '2-1',
      },
      {
        path: '/',
        label: 'DepthMenu2-02',
        value: '2-2',
      },
    ],
  },
  {
    path: '/',
    label: 'DropDownMenu3',
    value: '3',
  },
  {
    path: '/',
    label: 'DropDownMenu4',
    value: '4',
  },
];

export const dropdownMenu2 = [
  {
    path: '/',
    label: '2023',
    value: '1',
  },
  {
    path: '/',
    label: '2022',
    value: '2',
  },
  {
    path: '/',
    label: '2021',
    value: '3',
  },
  {
    path: '/',
    label: '2020',
    value: '4',
  },
  {
    path: '/',
    label: '2019',
    value: '5',
  },
];

export const homeworkerList = [
  {
    name: '김도은',
    label: 'CT2',
    position: '리더',
    project: '아난티 커머스 플렛폼',
  },
  {
    name: '김도은',
    label: 'CT2',
    position: '리더',
    project: '아난티 커머스 플렛폼',
  },
  {
    name: '김도은',
    label: 'CT2',
    position: '리더',
    project: '아난티 커머스 플렛폼',
  },
  {
    name: '김도은',
    label: 'CT2',
    position: '리더',
    project: '아난티 커머스 플렛폼',
  },
  {
    name: '김도은',
    label: 'CT2',
    position: '리더',
    project: '아난티 커머스 플렛폼',
  },
];

export const noticeList = [
  {
    type: '공지',
    title:
      '날씨 정보를 제공하는 국내외 오픈 API 세 가지 날씨 정보를 제공하는 국내외 오픈 API 세 가지',
    path: '/',
    img: '/img',
  },
  {
    type: '인사',
    title: '2023년 1월 승진자 안내',
    path: '/',
    img: '/img',
  },
];

export const employeeList = [
  {
    name: '송강',
    position: '리더',
    part: 'BT2 부문 CT2 본부',
    img: 'sample-img.jpeg',
  },
  {
    name: '박보검',
    position: '리더',
    part: 'BT2 부문 CT2 본부',
    img: 'sample-img.jpeg',
  },
  {
    name: '차은우',
    position: '선임 리더',
    part: 'BT2 부문 CT2 본부',
    img: 'sample-img.jpeg',
  },
  {
    name: '한지민',
    position: '파트장',
    part: 'BT2 부문 CT2 본부',
    img: 'sample-img.jpeg',
  },
  {
    name: '강호동',
    position: '파트장',
    part: 'BT2 부문 CT2 본부',
    img: 'sample-img.jpeg',
  },
];
