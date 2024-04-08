import api from "/src/services/useAxios";
import { OrientationTemplate } from "/src/types/PlanoAlimentarClassico";
import { create } from "zustand";

interface MyOrientationStore {
  orientations: OrientationTemplate[];

  selectedOrientation: OrientationTemplate | null;

  showModal: boolean;

  query: string;

  getOrientations: () => Promise<OrientationTemplate[]>;
  // eslint-disable-next-line no-unused-vars
  handleSelectOrientation: (orientation: OrientationTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (showModal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  updateOrientation: (orientations: OrientationTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  removeOrientation: (orientation: OrientationTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  addOrientation: (orientation: OrientationTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useMyOrientationStore = create<MyOrientationStore>(set => ({
  orientations: [],

  selectedOrientation: null,

  showModal: false,

  query: "",

  getOrientations: async () => {
    const { data } = await api.get("/orientacao-nutricional")

    set({ orientations: data });

    return data;
  },

  handleSelectOrientation: (orientation: OrientationTemplate) => {
    set({ selectedOrientation: orientation, showModal: true});
  },

  setShowModal: (showModal: boolean) => {
    set({ showModal });
  },

  updateOrientation: (orientations: OrientationTemplate) => {
    set(state => ({
      orientations: state.orientations.map(orientation => {
        if (orientation.id === orientations.id) {
          return orientations;
        }
        return orientation;
      })
    }));
  },

  removeOrientation: (orientation: OrientationTemplate) => {
    set(state => ({
      orientations: state.orientations.filter(item => item.id !== orientation.id)
    }));

    api.delete(`/orientacao-nutricional/${orientation.id}`);
  },

  addOrientation: (orientation: OrientationTemplate) => {
    set(state => ({
      orientations: [orientation, ...state.orientations]
    }));
  },

  setQuery: (query: string) => {
    set({ query });
  }
}));