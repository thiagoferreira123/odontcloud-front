import React from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useMyEquivalentFoodStore } from './hooks/MyEquivalentFoodStore';

// eslint-disable-next-line no-unused-vars
const SearchInput = () => {
  const query = useMyEquivalentFoodStore((state) => state.query);
  const { setQuery } = useMyEquivalentFoodStore();

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
