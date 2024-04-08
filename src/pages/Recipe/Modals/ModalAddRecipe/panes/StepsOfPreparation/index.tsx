import NotificationIcon from '/src/components/toast/NotificationIcon';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useCallback, useEffect } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { RecipeHistoryRecipeMethodOfPreparation } from '/src/types/ReceitaCulinaria';
import { useModalAddRecipeStore } from '../../hooks/ModalAddRecipeStore';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

export default function StepsOfPreparation() {
  const [preparations, setPreparations] = React.useState<RecipeHistoryRecipeMethodOfPreparation[]>([]);
  const preparations_ = useModalAddRecipeStore((state) => state.preparations);

  const { updatePreparations, removePreparation } = useModalAddRecipeStore();

  const handleChangeStepDescription = (step: RecipeHistoryRecipeMethodOfPreparation, value: string) => {
    setPreparations(preparations.map((preparation) => (preparation.id === step.id ? { ...preparation, passo_descricao: value } : preparation)));
  };

  const handleBlurStepDescription = () => {
    updatePreparations(preparations);
  };

  const handleAddPreparation = useCallback(() => {
    const payload: RecipeHistoryRecipeMethodOfPreparation = {
      id: btoa(Math.random().toString()).substring(0, 12),
      passo_descricao: '',
      passo_numero: preparations.length + 1,
    };

    updatePreparations([...preparations, payload]);
  }, [preparations, updatePreparations])

  const handleRemovePreparation = async (step: RecipeHistoryRecipeMethodOfPreparation) => {
    try {
      await removePreparation(step);
    } catch (error) {
      console.error(error);
      notify('Ocorreu um erro ao tentar remover o modo de preparo', 'Erro', 'close', 'danger')
    }
  }

  useEffect(() => {
    if (preparations_) setPreparations(preparations_);
  }, [preparations_]);

  useEffect(() => {
    if(preparations.length || preparations_.length) return;

    handleAddPreparation()
  }, [handleAddPreparation, preparations.length, preparations_]);

  return (
    <>
      <div className="col-12 mb-3">
        {preparations.map((step) => (
          <InputGroup className="mb-2" key={step.id}>
          <InputGroup.Text>{step.passo_numero}</InputGroup.Text>
          <FormControl
              type="text"
              value={step.passo_descricao}
              onChange={(event) => handleChangeStepDescription(step, event.target.value)}
              onBlur={handleBlurStepDescription}
          />

          <InputGroup.Text className="text-danger" role="button" tabIndex={0} onClick={() => handleRemovePreparation(step)}>
              <CsLineIcons icon="bin" />
          </InputGroup.Text>
      </InputGroup>

        ))}

        <div className="col justify-content-center text-center">
          <Button
            type="button"
            className="btn-icon btn-icon-start mt-2"
            variant="outline-primary"
            onClick={handleAddPreparation}
          >
            <CsLineIcons icon="plus" />
            <span>Adicionar modo de preparo</span>
          </Button>
        </div>
      </div>
    </>
  );
}
