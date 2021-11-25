export default [
  {
    path: '/admin-app/user',
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
    path: '/admin-app/node/share',
    name: 'Share Nodes',
    component: './node/NodeList',
    icon: 'UnorderedListOutlined'
  },
  {
    path: '/admin-app/node/fetch',
    name: 'Fetch Nodes',
    component: './node/FetchNodeList',
    icon: 'UnorderedListOutlined'
  },
  {
    path: '/admin-app/admin/management',
    name: 'Admin Management',
    component: './admin/Create',
    icon: 'CodepenOutlined'
  },
  {
    path: '/admin-app/admin/password',
    name: 'Password Change',
    component: './admin/PasswordChange',
    icon: 'CodepenOutlined'
  },

  {
    path: '/admin-app/',
    redirect: '/admin-app/node/share',
  },
  {
    component: './404',
  },
];
