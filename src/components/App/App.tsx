import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote } from '../../services/noteService';
import type { NewNoteBody } from '../../types/note';
import Modal from '../Modal/Modal';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

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

  // Форма відправки
  const queryClient = useQueryClient();

  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const handleCreateNote = (values: NewNoteBody) => {
    addNote(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          inputValue={searchQuery}
          onChange={handleSearch}
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

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateNote}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
