import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/auth/Login/index.vue'
import Signup from '@/views/auth/Signup/index.vue'
import ForgotPassword from '@/views/auth/Password/ForgotPassword.vue'
import ResetPasswordEmail from '@/views/auth/Password/ResetPasswordEmail.vue'

import AdminUserManagment from '@/views/admin/AdminUserManagment.vue';
import AdminListEvent from '@/views/admin/AdminListEvent.vue';
import AdminCreateEvent from '@/views/admin/AdminCreateEvent.vue';

import EventHome from "@/views/event/index.vue"
import EventStatisticViewer from "@/views/event/EventStatisticViewer.vue"

import DashboardGeral from "@/views/dashboad/index.vue"

import Calendar from "@/views/event/calendar/index.vue"
import Speakers from "@/views/event/speakers/index.vue"
import SpeakersAdmin from '@/views/event/speakers/index.admin.vue'
import Registrations from "@/views/event/registrations/index.vue"
import EventRegistrationsShow from "@/views/event/registrations/show.vue"
import Tickets from "@/views/event/tickets/index.vue"
import MyEvents from "@/views/event/my_events/index.vue"
import RegistrationTable from "@/views/event/components/RegistrationTableSingle.vue"
import TicketsTable from "@/views/event/components/TicketsTable.vue"
import Finaces from "@/views/event/finances/index.vue"
import FinancesInvestiments from "@/views/event/finances/components/FinancesInvestiments.vue"
import FinancesIncome from "@/views/event/finances/components/FinancesIncome.vue"
import FinancesExpenses from "@/views/event/finances/components/FinancesExpenses.vue"
import FinancesReports from "@/views/event/finances/components/FinancesReports.vue"

import Analitics from "@/views/statistic_repots/analitics/index.vue"
import AnaliticsShow from "@/views/statistic_repots/analitics/show.vue"
import Reports from "@/views/statistic_repots/reports/index.vue"

import Import from "@/views/data/import/index.vue"
import Export from "@/views/data/export/index.vue"

import Settings from "@/views/setting/settings/index.vue"
// import Logs from "@/views/setting/logs/index.vue"
import ResetMyPassword from "@/views/setting/password/index.vue"

import Users from "@/views/seguranca/users/index.vue"
import Permissions from "@/views/seguranca/rules/index.vue"
import Groups from "@/views/seguranca/groups/index.vue"

import Profile from "@/views/profile/index.vue"

import EventViewer from "@/views/event/show.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', name: 'home', component: HomeView,
      meta: {
        layout: 'navbar-layout'
      }
    },
    {
      path: '/login', name: 'login', component: Login,
      meta: {
        layout: 'empty-layout'
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        layout: 'empty-layout'
      }
    },

    {
      path: "/forgot",
      name: "forgot.password",
      component: ForgotPassword,
      meta: {
        layout: 'empty-layout'
      }
    },
    {
      path: "/resetpasswordEmail/:token",
      name: "reset.password",
      component: ResetPasswordEmail,
      meta: {
        layout: 'empty-layout'
      }
    },

    {
      path: '/dashboard/overview',
      name: 'dashboard.overview',
      component: DashboardGeral,
      meta: {
        layout: 'default-layout'
      }
    },

    //////////////////////////////////////////////////////////////////////////////
    // "gestao-eventos.create",
    {
      path: '/gestao-de-eventos/criar-evento',
      name: 'gestao-eventos.create',
      component: AdminCreateEvent,
      meta: {
        layout: 'default-layout'
      }
    },
    // "gestao-eventos.list"
    {
      path: '/gestao-eventos/listar-eventos',
      name: 'gestao-eventos.list',
      component: AdminListEvent,
      meta: {
        layout: 'default-layout'
      }
    },
    {
      path: '/gestao-eventos/meus-eventos',
      name: 'gestao-eventos.my_events',
      component: MyEvents,
      meta: {
        layout: 'default-layout'
      }
    },
    {
      path: '/gestao-eventos/meus-eventos/:id', name: 'event.show', component: EventViewer,
      meta: { layout: 'default-layout' },
      children: [
        {
          path: 'inscricoes',
          name: 'event.show.registrations',
          component: RegistrationTable,
        },

        {
          path: 'ingressos',
          name: 'event.show.tickets',
          component: TicketsTable,
        }
      ]
    },
    // "gestao-eventos.calendar",
    {
      path: '/gestao-de-eventos/calendario',
      name: 'gestao-eventos.calendar',
      component: Calendar,
      meta: {
        layout: 'default-layout'
      }
    },
    // "gestao-eventos.speakers",
    {
      path: '/gestao-de-eventos/admin_palestrantes', name: 'gestao-eventos.admin_speakers',
      component: SpeakersAdmin,
      meta: {
        layout: 'default-layout'
      }
    },
    {
      path: '/gestao-de-eventos/palestrantes',
      name: 'gestao-eventos.speakers',
      component: Speakers,
      meta: {
        layout: 'default-layout'
      }
    },
    {
      path: '/gestao-de-eventos/palestrantes/:id?',
      name: 'gestao-eventos.speakers.show',
      component: Speakers,
      meta: {
        layout: 'default-layout'
      }
    },
    // "gestao-eventos.registrations",
    {
      path: '/gestao-de-eventos/inscricoes',
      name: 'gestao-eventos.registrations',
      component: Registrations,
      meta: {
        layout: 'default-layout'
      }
    },

    {
      path: '/gestao-de-eventos/inscricoes/:id',
      name: 'event.registrations.show',
      component: EventRegistrationsShow,
    },

    {
      path: '/gestao-de-eventos/tickets',
      name: 'gestao-eventos.tickets',
      component: Tickets,
      meta: {
        layout: 'default-layout'
      }
    },

    {
      path: '/gestao-eventos/financas',
      name: 'gestao-eventos.finance',
      component: Finaces,
      meta: {
        layout: 'default-layout'
      },
      children: [
        {
          path: 'investimentos',
          name: 'gestao-eventos.finance.investments',
          component: FinancesInvestiments,
        },
        {
          path: 'receitas',
          name: 'gestao-eventos.finance.income',
          component: FinancesIncome,
        },
        {
          path: 'despesas',
          name: 'gestao-eventos.finance.expenses',
          component: FinancesExpenses,
        },
        {
          path: 'relatorios',
          name: 'gestao-eventos.finance.reports',
          component: FinancesReports,
        }
      ]
    },

    // "analise-relatorios.analitics",
    {
      path: '/analise-relatorios/mapa-do-evento',
      name: 'analise_relatorios.analitics',
      component: Analitics,
      meta: {
        layout: 'default-layout'
      }
    },
    {
      path: '/analise-relatorios/mapa-do-evento/:id',
      name: 'analise_relatorios.analitics.show',
      component: AnaliticsShow,
      meta: {
        layout: 'default-layout'
      }
    },
    // "analise-relatorios.reports",
    {
      path: '/analise-relatorios/relatorios',
      name: 'analise-relatorios.reports',
      component: Reports,
      meta: {
        layout: 'default-layout'
      }
    },
    // "importacao.import",
    {
      path: '/importar',
      name: 'importacao.import',
      component: Import,
      meta: {
        layout: 'default-layout'
      }
    },
    // "exportacao.export",
    {
      path: '/exportar',
      name: 'exportacao.export',
      component: Export,
      meta: {
        layout: 'default-layout'
      }
    },
    // "seguranca.users",
    {
      path: '/seguranca/usuarios',
      name: 'seguranca.users',
      component: AdminUserManagment,
      meta: {
        layout: 'default-layout'
      }
    },
    // "seguranca.permissions",
    {
      path: '/seguranca/permissoes',
      name: 'seguranca.permissions',
      component: Permissions,
      meta: {
        layout: 'default-layout'
      }
    },
    // "seguranca.groups",
    {
      path: '/seguranca/grupos',
      name: 'seguranca.groups',
      component: Groups,
      meta: {
        layout: 'default-layout'
      }
    },
    // "configuracoes.settings",
    {
      path: '/configuracoes/gerais',
      name: 'setting.general',
      component: Settings,
      meta: {
        layout: 'default-layout'
      }
    },

    {
      path: '/configuracoes/eventos',
      name: 'setting.event',
      component: Settings,
      meta: {
        layout: 'default-layout'
      },
      children: [
        {
          path: 'gerais',
          name: 'setting.event.general',
          component: Settings,
        },
        {
          path: 'Categoria',
          name: 'setting.event.categories',
          component: Settings,
        },
        {
          path: 'Departamentos',
          name: 'setting.event.departments',
          component: Settings,
        },
        {
          path: 'Relatorios',
          name: 'setting.event.reports',
          component: Settings,
        }
      ]
    },
    // "configuracoes.logs",
    // {
    //   path: '/configuracoes/logs',
    //   name: 'configuracoes.logs',
    //   component: Logs,
    //   meta: {
    //     layout: 'default-layout'
    //   }
    // },

    // "profile.geral",
    {
      path: '/perfil',
      name: 'profile.geral',
      component: Profile,
      meta: {
        layout: 'default-layout'
      }
    },

  ]
})

export default router
