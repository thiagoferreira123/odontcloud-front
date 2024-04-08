import { QueryClient } from "@tanstack/react-query";
import { User } from "../../Auth/Login/hook/types";


export interface ProfessionalSite {
  id?: number;
  professional?: User;
  professionalPhotoLink: string;
  presentation: string;
  aboutMe: string;
  impactPhrase: string;
  services: any[];
  specialities: any[];
  websiteUrl: string;
  websiteColor: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  backgroundImage: string;
}


export type ProfessionalSiteActions = {
  addSite: (siteData: Partial<ProfessionalSite>, queryClient: QueryClient) => Promise<number | false>;
  updateSite: (siteData: ProfessionalSite, queryClient: QueryClient) => Promise<boolean>;
  removeSite: (siteId: number, queryClient: QueryClient) => Promise<boolean>;
};

export type ProfessionalSiteStore = {
  getSite: () => Promise<ProfessionalSite | false>;
  getSiteByUrl: (url: string) => Promise<ProfessionalSite | false>;
} & ProfessionalSiteActions;
