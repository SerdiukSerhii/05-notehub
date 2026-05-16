import { useState } from 'react';
import css from './App.module.css';
import Modal from '../Modal/Modal';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const totalPages = data?.totalPages ?? 0;
  const totalPages = 5;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Кнопка створення нотатки */}

        <button
          onClick={() => setIsModalOpen(true)}
          className={css.button}
        >
          Create note +
        </button>
      </header>
      <NoteList />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* <NoteForm /> */}
        </Modal>
      )}
    </div>
  );
}

export default App;
