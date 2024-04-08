import NotificationIcon from '/src/components/toast/NotificationIcon';
import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import React, { ReactText, useCallback, useEffect, useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import api from '/src/services/useAxios';
import { EquivalentEatingPlanCustomList, EquivalentEatingPlanGrupoSelectedFood } from '/src/types/PlanoAlimentarEquivalente';
import { Option } from '/src/types/inputs';

const getListGroups = async (): Promise<EquivalentEatingPlanCustomList[]> => {
  const { data } = await api.get('/plano-alimentar-equivalente-lista-personalizada/all');
  return data;
};

const insertGroupId = (food: EquivalentEatingPlanGrupoSelectedFood, groupName: string) => {
  return {
    ...food,
    group_id: Number(groupName),
  };
};

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });


// eslint-disable-next-line no-unused-vars
function SearchReplacementLists(props: {setIsSelecting: (isSelecting: boolean) => void}) {
  const [value, setValue] = useState<Option>();
  const toastId = useRef<ReactText>();

  const [listgroups, setListGroups] = useState<EquivalentEatingPlanCustomList[]>([]);

  const [options, setOptions] = useState<Option[]>([]);

  const lista_id = useEquivalentEatingPlanStore((state) => state.lista_id);

  const { setSelectedFoods, setListId, removeMealsFoods } = useEquivalentEatingPlanStore();
  const planId = useEquivalentEatingPlanStore((state) => state.planId);

  const onChangeList = async (option: SingleValue<Option>) => {
    if (!option) return;

    setValue(option);

    const listGroup = listgroups.find((lg) => lg.id === Number(option.value));

    if (!listGroup) return;

    const loadingMessage = listGroup.nome_lista == 'Desmarcar todos os alimentos' ? 'Desmarcando alimentos...' : 'Selecionando alimentos...';
    const newListId = listGroup.nome_lista == 'Desmarcar todos os alimentos' ? null : listGroup.id;
    toastId.current = notify(loadingMessage, 'Sucesso', 'check', 'success', true);

    props.setIsSelecting(true);

    try {
      const response = await api.post('/plano-alimentar-equivalente-grupo-alimento-selecionado/selecionar-lista/' + planId, listGroup);

      const loadedSelectedFoods = response.data.map(insertGroupId);

      setSelectedFoods(loadedSelectedFoods);
      setListId(newListId);

      await api.patch('/plano-alimentar-equivalente-historico/' + planId, { lista_id: newListId});

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Lista atualizada com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });
      props.setIsSelecting(false);
      removeMealsFoods();
    } catch (error) {
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao atualizar lista!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
      props.setIsSelecting(false);
    }
  };

  const buildListGroups = useCallback(async () => {
    const listGroups = await getListGroups();
    setListGroups(listGroups);

    if(lista_id) {
      const option = listGroups.find((lg) => lg.id === Number(lista_id));
      if(option) setValue({ label: option.nome_lista, value: String(option.id) });
    }
  }, [lista_id]);

  useEffect(() => {
    buildListGroups();
  }, [buildListGroups, setListGroups]);

  useEffect(() => {
    const options = listgroups.map((listgroup) => ({ label: listgroup.nome_lista, value: String(listgroup.id) }));
    setOptions(options);
  }, [listgroups]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={onChangeList} placeholder="Busque por um modelo de lista" />;
}

export default SearchReplacementLists;
