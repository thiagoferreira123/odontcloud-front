import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useMyOrientationStore } from './hooks/MyOrientationStore';

const SearchInput = () => {
  const query = useMyOrientationStore((state) => state.query);
  const { setQuery } = useMyOrientationStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome da orientação"
      />
      {query && query.length > 0 ? (
        <span
          className="search-delete-icon"
          onClick={() => {
            setQuery('');
          }}
        >
          <CsLineIcons icon="close" />
        </span>
      ) : (
        <span className="search-magnifier-icon pe-none">
          <CsLineIcons icon="search" />
        </span>
      )}
    </>
  );
};

export default SearchInput;
