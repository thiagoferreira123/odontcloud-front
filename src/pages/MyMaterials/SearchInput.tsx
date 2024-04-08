import CsLineIcons from "../../cs-line-icons/CsLineIcons";
import useMyMaterialsStore from "./hooks/MyMaterialsStore";

const SearchInput = () => {
  const query = useMyMaterialsStore((state) => state.query);
  const { setQuery } = useMyMaterialsStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome da funcionalidade"
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
