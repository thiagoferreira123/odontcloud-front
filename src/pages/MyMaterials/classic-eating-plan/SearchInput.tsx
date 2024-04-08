import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import useClassicPlans from './hooks/useClassicPlans';

const SearchInput = () => {
  const query = useClassicPlans((state) => state.query);
  const { setQuery } = useClassicPlans();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome do plano alimentar"
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
