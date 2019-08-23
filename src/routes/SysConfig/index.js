import React from 'react'
import mergeRoute from 'components/mergeRoutes'
const Organ = React.lazy(() => import('./Organ'))
const User = React.lazy(() => import('./User'))
const UserAdd = React.lazy(() => import('./UserAdd'))
const RoleList = React.lazy(() => import('./Role'))
const AuthList = React.lazy(() => import('./Authority'))
export default mergeRoute([
  {
    path: '/organization/organization',
    tmpl: Organ
  },
  {
    path: '/user/user',
    tmpl: User
  },
  {
    path: '/user/userAdd',
    tmpl: UserAdd
  },
  {
    path: '/user/userEdit/:id',
    tmpl: UserAdd
  },
  {
    path: '/role/role',
    tmpl: RoleList
  },
  {
    path: '/authority/authority',
    tmpl: AuthList
  },
  {
    path: '/authority/authority123',
    tmpl: AuthList
  }
])
