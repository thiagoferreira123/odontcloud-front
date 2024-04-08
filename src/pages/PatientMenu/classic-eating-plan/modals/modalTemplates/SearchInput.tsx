import CsLineIcons from "../../../../../cs-line-icons/CsLineIcons";

interface SearchInputProps {
  placeholder?: string;
  query: string;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

const SearchInput = (props: SearchInputProps) => {
  return (
    <>
      <input
        className="form-control datatable-search"
        value={props.query || ''}
        onChange={(e) => {
          props.setQuery(e.target.value);
        }}
        placeholder={props.placeholder || 'Digite o nome do plano alimentar'}
      />
      {props.query && props.query.length > 0 ? (
        <span
          className="search-delete-icon"
          onClick={() => {
            props.setQuery('');
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
