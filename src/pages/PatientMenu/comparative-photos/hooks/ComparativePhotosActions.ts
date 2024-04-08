import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ComparativePhotos, ComparativePhotosActions } from "./types";

const useComparativePhotosActions = (): ComparativePhotosActions => ({
  addComparativePhotosDetail: async (photo, queryClient) => {
    try {
      const { data } = await api.post<ComparativePhotos>('/antropometria-foto/', photo);

      queryClient.setQueryData<ComparativePhotos[]>(['antropometria-foto', photo.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Foto adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar foto', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeComparativePhotosDetail: async (photo, queryClient) => {
    try {
      await api.delete(`/antropometria-foto/${photo.id}`);

      queryClient.setQueryData<ComparativePhotos[]>(['antropometria-foto', photo.patient_id], (oldData) => oldData?.filter((item) => item.id !== photo.id));

      return true;
    } catch (error) {
      notify('Erro ao remover foto', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useComparativePhotosActions;
