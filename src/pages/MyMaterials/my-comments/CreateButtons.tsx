import { Button, Col } from 'react-bootstrap';
import { CommentTemplate, useMyCommentStore } from './hooks/MyCommentStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function CreateButtons() {
  const { handleSelectComment } = useMyCommentStore();

  const handleCreateComment = () => {
    const newComment = {
      nome: '',
      comentario: '',
    };

    handleSelectComment(newComment);
  };

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleCreateComment()}>
        <CsLineIcons icon="check" /> <span>Cadastrar um comentário</span>
      </Button>
    </Col>
  );
}
