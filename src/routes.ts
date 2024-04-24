import { lazy } from 'react';
import { DEFAULT_PATHS } from './config';
import { RouteItemProps } from './routing/protocols/RouteIdentifier';

const dashboard = lazy(() => import('./pages/Dashboard'));

const Login = {
  index: lazy(() => import('./pages/Auth/Login')),
  ForgotPassword: lazy(() => import('./pages/Auth/ForgotPassword/index')),
  Register: lazy(() => import('./pages/Auth/Register/index')),
  ResetPassword: lazy(() => import('./pages/Auth/ResetPassword/index')),
};

const ferramentas = {
  index: lazy(() => import('./views/apps/Apps')),
  calendar: lazy(() => import('./pages/Calendar')),
  PatientControl: lazy(() => import('./pages/PatientControl')),
  FinancialControl: lazy(() => import('./pages/FinancialControl')),
  Pricing: lazy(() => import('./pages/Pricing')),
  MySettings: lazy(() => import('./pages/MySettings')),
  ProfessionalWebsite: lazy(() => import('./pages/ProfessionalWebsite')),
};

const pages = {
  index: lazy(() => import('./views/pages/Pages')),
  authentication: {
    login: lazy(() => import('./pages/authentication/Login')),
    register: lazy(() => import('./pages/authentication/Register')),
    forgotPassword: lazy(() => import('./pages/authentication/ForgotPassword')),
    resetPassword: lazy(() => import('./pages/authentication/ResetPassword')),
  },

  Anamnesis: lazy(() => import('./pages/Anamnesis/')),
  MySettings: lazy(() => import('./pages/MySettings/')),
  CarePlan: lazy(() => import('./pages/CarePlan')),
  Budget: lazy(() => import('./pages/Budget')),
};

const patientMenu = {
  index: lazy(() => import('./pages/PatientMenu')),
  Register: lazy(() => import('./pages/Auth/Register/index')),
  ResetPassword: lazy(() => import('./pages/Auth/ResetPassword/index')),
  Anamnesis: lazy(() => import('./pages/PatientMenu/anamnesis-patient')),
  HistoryPatientFolder: lazy(() => import('./pages/PatientMenu/patient-folder')),
  MySettings: lazy(() => import('./pages/MySettings/')),
  Receipt: lazy(() => import('./pages/PatientMenu/receipt')),
  AttendanceCertificate: lazy(() => import('./pages/PatientMenu/attendance-certificate')),
  CarePlan: lazy(() => import('./pages/PatientMenu/care-plan')),
  Budget: lazy(() => import('./pages/PatientMenu/budget')),
};

export const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(0, DEFAULT_PATHS.APP.length - 1) : DEFAULT_PATHS.APP;

export interface RoutesAndMenuItems {
  mainMenuItems: RouteItemProps[];
  sidebarItems: RouteItemProps[];
}

const routesAndMenuItems: RoutesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      label: 'home',
      icon: 'home',
      component: dashboard,
      roles: [],
    },
    {
      path: `${appRoot}/menu-paciente/:id`,
      label: 'menu-paciente',
      component: patientMenu.index,
      hideInMenu: true,
      roles: [],
      subs: [
        { path: '/meus-dados', component: patientMenu.MySettings },
        { path: '/anamnese', component: patientMenu.Anamnesis },
        { path: '/recibo', component: patientMenu.Receipt },
        { path: '/atestado', component: patientMenu.AttendanceCertificate },
        { path: '/pasta-do-paciente', component: patientMenu.HistoryPatientFolder },
        { path: '/plano-de-tratamento', component: patientMenu.CarePlan },
        { path: '/orcamento', component: patientMenu.Budget },
      ],
    },
    {
      path: `${appRoot}/plano-de-tratamento/:id`,
      component: pages.CarePlan,
      hideInMenu: true,
      roles: [],
    },
    {
      path: `${appRoot}/orcamento/:id`,
      component: pages.Budget,
      hideInMenu: true,
      roles: [],
    },
    {
      path: `${appRoot}/anamnese/:id`,
      label: 'menu.anamnese',
      component: pages.Anamnesis,
      hideInMenu: true,
      roles: [],
    },
    {
      path: `${appRoot}/meus-dados`,
      label: 'menu.meus-dados',
      component: ferramentas.MySettings,
      hideInMenu: true,
      roles: [],
    },
    {
      path: `${appRoot}/planos`,
      label: 'menu.planos',
      hideInMenu: true,
      component: ferramentas.Pricing,
      roles: [],
    },
    {
      path: `${appRoot}/ferramentas`,
      label: 'menu.apps',
      icon: 'screen',
      roles: [],
      isExternal: true,
      subs: [
        { path: '/calendar', label: 'menu.calendar', component: ferramentas.calendar },
        { path: '/controle-pacientes', label: 'menu.controle-pacientes', component: ferramentas.PatientControl },
        { path: '/controle-financeiro', label: 'menu.controle-financeiro', component: ferramentas.FinancialControl },
        // { path: '/site', label: 'menu.site', component: ferramentas.ProfessionalWebsite },
      ],
    },
  ],

  sidebarItems: [
    { path: '#connections', label: 'menu.connections', icon: 'diagram-1', hideInRoute: true },
    { path: '#bookmarks', label: 'menu.bookmarks', icon: 'bookmark', hideInRoute: true },
    { path: '#requests', label: 'menu.requests', icon: 'diagram-2', hideInRoute: true },
    {
      path: '#account',
      label: 'menu.account',
      icon: 'user',
      hideInRoute: true,
      subs: [
        { path: '/settings', label: 'menu.settings', icon: 'gear', hideInRoute: true },
        { path: '/password', label: 'menu.password', icon: 'lock-off', hideInRoute: true },
        { path: '/devices', label: 'menu.devices', icon: 'mobile', hideInRoute: true },
      ],
    },
    {
      path: '#notifications',
      label: 'menu.notifications',
      icon: 'notification',
      hideInRoute: true,
      subs: [
        { path: '/email', label: 'menu.email', icon: 'email', hideInRoute: true },
        { path: '/sms', label: 'menu.sms', icon: 'message', hideInRoute: true },
      ],
    },
    {
      path: '#downloads',
      label: 'menu.downloads',
      icon: 'download',
      hideInRoute: true,
      subs: [
        { path: '/documents', label: 'menu.documents', icon: 'file-text', hideInRoute: true },
        { path: '/images', label: 'menu.images', icon: 'file-image', hideInRoute: true },
        { path: '/videos', label: 'menu.videos', icon: 'file-video', hideInRoute: true },
      ],
    },
  ],
};
export default routesAndMenuItems;
