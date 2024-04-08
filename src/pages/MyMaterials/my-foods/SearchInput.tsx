import { useMyFoodStore } from './hooks/MyFoodStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const SearchInput = () => {
  const query = useMyFoodStore((state) => state.query);
  const { setQuery } = useMyFoodStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome do alimento"
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
