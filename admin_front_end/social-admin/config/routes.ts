export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

  {
    path: '/node/share',
    name: 'Share Nodes',
    component: './node/NodeList',
    icon: 'UnorderedListOutlined'
  },
  {
    path: '/node/fetch',
    name: 'Fetch Nodes',
    component: './node/FetchNodeList',
    icon: 'UnorderedListOutlined'
  },
  {
    path: '/admin/management',
    name: 'Admin Management',
    component: './admin/Create',
    icon: 'CodepenOutlined'
  },
  {
    path: '/admin/password',
    name: 'Password Change',
    component: './admin/PasswordChange',
    icon: 'CodepenOutlined'
  },

  {
    path: '/',
    redirect: '/node/share',
  },
  {
    component: './404',
  },
];
