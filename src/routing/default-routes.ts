import { lazy } from 'react';
import PatientLogin from '../pages/Auth/PatientLogin';
import SignatureStatus from '../pages/SignatureStatus';
import NotFound from '../views/default/NotFound';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import Unauthorized from '../views/default/Unauthorized';
import InvalidAccess from '../views/default/InvalidAccess';
import App from '../App';
import Home from '../views/default/Home';
import { RouteItemProps } from './protocols/RouteIdentifier';
import { DEFAULT_PATHS } from '../config';
import PanelPatient from '../pages/PanelPatient';
import FormResponsePage from '../pages/FormResponsePage';
import Meet from '../pages/Meet';
import MetabolicTrakingLooseResponse from '../pages/MetabolicTrakingLooseResponse';
import ProfessionalWebsitePreview from '../pages/ProfessionalWebsitePreview';
import ProfessionalWebSiteSchedule from '../pages/ProfessionalWebSiteSchedule';

/*
{ path: "/path", exact: true, component: ViewHome },
// or
{ path: "/path", component: ViewHome},
// or
{ path: "/path", exact: true, redirect: true, to: "/redirectPath" },
*/
const defaultRoutes: RouteItemProps[] = [
  { path: DEFAULT_PATHS.NOTFOUND, exact: true, component: NotFound },
  { path: DEFAULT_PATHS.LOGIN, exact: true, component: Login },
  { path: DEFAULT_PATHS.PATIENT_LOGIN, exact: true, component: PatientLogin },
  { path: DEFAULT_PATHS.PATIENT_DASHBOARD, exact: true, component: PanelPatient },
  { path: DEFAULT_PATHS.REGISTER, exact: true, component: Register },
  { path: DEFAULT_PATHS.FORGOT_PASSWORD, exact: true, component: ForgotPassword },
  { path: DEFAULT_PATHS.RESET_PASSWORD, exact: true, component: ResetPassword },
  { path: DEFAULT_PATHS.UNAUTHORIZED, exact: true, component: Unauthorized },
  { path: DEFAULT_PATHS.INVALID_ACCESS, exact: true, component: InvalidAccess },
  { path: DEFAULT_PATHS.MEET, exact: true, component: Meet },
  { path: DEFAULT_PATHS.METABOLIC_TRAKING, exact: true, component: MetabolicTrakingLooseResponse },
  { path: DEFAULT_PATHS.BLOCK, exact: true, component: SignatureStatus },
  { path: DEFAULT_PATHS.APP, component: App, protected: true },
  { path: DEFAULT_PATHS.PROFESSIONAL_WEBSITE, component: ProfessionalWebsitePreview },
  { path: DEFAULT_PATHS.SERVICE_LOCATION_SCHEDULE, component: ProfessionalWebSiteSchedule },
  { path: '/', exact: true, component: Home, redirect: true, to: DEFAULT_PATHS.APP },
  {
    path: '/',
    exact: true,
    component: App,
  },
  {
    path: '/formulario-pre-consulta-preencher/:id',
    component: FormResponsePage,
    publicOnly: true,
  },
];

export default defaultRoutes;
