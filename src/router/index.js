import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/auth/Login/index.vue'
import Signup from '@/views/auth/Signup/index.vue'
import ForgotPassword from '@/views/auth/Password/ForgotPassword.vue'

import Dashboard from "@/views/admin/Dashboard.vue";
import Overview from "@/views/admin/AdminOverview.vue";
import AdminUserManagment from '@/views/admin/AdminUserManagment.vue';
import AdminListEvent from '@/views/admin/AdminListEvent.vue';
import AdminCreateEvent from '@/views/admin/AdminCreateEvent.vue';

import EventHome from "@/views/event/index.vue"
import EventStatisticViewer from "@/views/event/EventStatisticViewer.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },

    {
      path: "/forgot",
      name: "forgot.password",
      component: ForgotPassword
    },

    //////////////////////////////////////////////////////////////////////////////
    {
      path: '/admin/:id?',
      name: 'admin.dashboard',
      component: Dashboard,
      children: [
        {
          path: 'overview',
          name: 'admin.overview',
          component: Overview
        },
        {
          path: 'event',
          name: 'admin.event',
          component: AdminListEvent
        },
        {
          path: 'create_event',
          name: 'admin.create_event',
          component: AdminCreateEvent
        },
        {
          path: 'users',
          name: 'admin.users',
          component: AdminUserManagment
        },
        {
          path: 'profile',
          name: 'admin.profile',
          component: {template: '<div>Profile</div>'}
        },
        {
          path: 'schedule',
          name: 'admin.schedules',
          component: {template: '<div>Schedule</div>'}
        },
        {
          path: 'reports/:eventId?',
          name: 'admin.reports',
          component: EventStatisticViewer
        },
        {
          path: 'import',
          name: 'admin.data.import',
          component: {template: '<div>Import</div>'}
        },
        {
          path: 'export',
          name: 'admin.data.export',
          component: {template: '<div>Export</div>'}
        },
        {
          path: 'settings',
          name: 'admin.settings',
          component: {template: '<div>Settings</div>'}
        },
      ]
    },

    {
      path: '/event/:id',
      name: 'event.home',
      component: EventHome
    },
    {
      path: '/event/:id/statistic',
      name: 'event.statistic',
      component: EventStatisticViewer
    }
  ]
})

export default router
