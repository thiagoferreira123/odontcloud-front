import { create } from "zustand";
import { AnsweredForm, AnsweredFormValue, FormItem } from "../../../../types/FormBuilder";
import api from "../../../../services/useAxios";
import { notify } from "../../../../components/toast/NotificationIcon";

interface ImportFormModalStore {
  showModal: boolean;
  query: string;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  hideModal: () => void;
  showImportFormModal: () => void;

  getAnsweredForms: () => Promise<AnsweredForm[] | false>;

  // eslint-disable-next-line no-unused-vars
  parseAnsweredFormToHTMLString: (form: AnsweredForm) => string;
}

const getOptionValue = ({ values, userData }: { values: AnsweredFormValue[], userData: string[] }) => {
  if (!userData.length) return '---';
  const answers = userData.map((data: string) => values.find((labelValue: { value: string }) => labelValue.value === data)?.label);
  return answers.join(', ');
};

export const useImportFormModalStore = create<ImportFormModalStore>((set) => ({
  showModal: false,
  query: '',
  selectedAnamnesis: null,

  setQuery: (query) => set({ query }),
  hideModal: () => {
    set({ showModal: false });
  },

  showImportFormModal: () => {
    set({ showModal: true });
  },

  getAnsweredForms: async () => {
    try {
      const { data } = await api.get<AnsweredForm[]>(`/fpc-respondido-paciente-nao-cadastrado/`);
      return data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    } catch (error) {
      console.error(error);
      notify("Erro ao buscar modelos de anamnese", "Erro", "close", "danger");
      return false;
    }
  },

  parseAnsweredFormToHTMLString: (form: AnsweredForm) => {
    const parsedAnswer = form.respostas ? (JSON.parse(form.respostas) as FormItem[]) : [];

    return parsedAnswer.reduce((acc, p) => {
      const content = ['cabeçalho', 'parágrafo'].includes(p.label.toLowerCase()) ? null : (
        ` <div className="d-flex mb-2 flex-column">
            <p><b>${p.label}</b></p>
            <p>${p.values ? getOptionValue({ values: p.values, userData: p.userData }) : p.userData?.[0] || '---'}</p>
          </div>`
      )

      return content ? acc + content : acc;
    }, '')
  }
}));