import css from '../SearchBox/SearchBox.module.css';

interface SearchBoxProps {
  inputValue: string;
  onChange: (newSearchValue: string) => void;
}

const SearchBox = ({ onChange, inputValue }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={inputValue}
      onChange={e => onChange(e.target.value)}
    />
  );
};
export default SearchBox;
