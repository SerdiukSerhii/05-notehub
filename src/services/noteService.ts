import axios from 'axios';
import type { Note, NewNoteBody } from '../types/note';

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface FetchNotesResponse {
  results: Note[];
  total_pages: number;
}

export const fetchNotes = async (
  query: string,
  page: number,
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>(`/notes`, {
    params: {
      query,
      page,
    },
  });

  return res.data;
};

export const createNote = async (newNote: NewNoteBody) => {
  const res = await api.post<Note>('/notes', newNote);
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};
