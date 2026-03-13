import { expect, it } from "vitest";
import { mapGoogleBookToEntity } from "./map-book";

it('deve retornar capa padrão quando a API não fornecer imagem', () => {
  const mockApiData = { id: '1', volumeInfo: { title: 'Teste' } };
  const result = mapGoogleBookToEntity(mockApiData);
  expect(result.coverUrl).toContain('placehold.co');
});