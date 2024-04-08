import Select from 'react-select';
import { useFiltersStore } from './hooks/FiltersStore';
import { Option } from '../../types/inputs';
import { Col } from 'react-bootstrap';

const years = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear();
  return { value: (year - i).toString(), label: `${year - i}` };
});

export default function YearFilter() {
  const selectedYear = useFiltersStore((state) => state.selectedYear);
  const { setSelectYear } = useFiltersStore();

  return (
    <>
      <Col sm={12} md="2" className="mb-1">
        <Select classNamePrefix="react-select" options={years} value={selectedYear} onChange={(e) => setSelectYear(e as Option)} placeholder="" />
      </Col>
      {/* <SearchInput /> */}
    </>
  );
}
