import { ChecklistConduct, ChecklistConductItem } from "../ChecklistConductsStore/types";


export type ConductItemActions = {
  addConductItem: (item: ChecklistConductItem) => boolean;
  updateConductItem: (item: ChecklistConductItem) => boolean;
  removeConductItem: (item: ChecklistConductItem) => boolean;
  setItems: (items: ChecklistConductItem[]) => void;
};

export type ChecklistConductModalStore = {
  showModal: boolean;

  selectedChecklistConduct: ChecklistConduct | null;

  hideModal: () => void;
  handleSelectChecklistConductToEdit: (assessment: ChecklistConduct) => void;
  handleShowCreateChecklistConductModal: () => void;
} & ConductItemActions;
