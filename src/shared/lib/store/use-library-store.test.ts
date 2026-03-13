import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from './use-library-store';

describe('useLibraryStore', () => {
  beforeEach(() => {
    useLibraryStore.setState({ books: [] });
  });

  it('deve adicionar um livro na biblioteca', () => {
    const { addBook } = useLibraryStore.getState();
    const mockBook = { id: '1', title: 'Livro Teste', author: 'Autor' } as any;

    addBook(mockBook);

    const { books } = useLibraryStore.getState();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Livro Teste');
  });

  it('deve remover um livro da biblioteca', () => {
    const { addBook, removeBook } = useLibraryStore.getState();
    const mockBook = { id: '1', title: 'Livro Teste' } as any;

    addBook(mockBook);
    removeBook('1');

    const { books } = useLibraryStore.getState();
    expect(books).toHaveLength(0);
  });
});