import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import Modal from '../Modal/Modal';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
  });

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  // Відкладене оновлення пошукового запиту
  const handleSearch = useDebouncedCallback((newSearchValue: string) => {
    setSearchQuery(newSearchValue);
    setCurrentPage(1);
  }, 300);

  // Обробка введення тексту в SearchBox
  const onSearchChange = (newSearchValue: string) => {
    handleSearch(newSearchValue);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          inputValue={searchQuery}
          onChange={onSearchChange}
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className={css.button}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {NoteList.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* <NoteForm /> */}
        </Modal>
      )}
    </div>
  );
}

export default App;
