import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './index';
import '@testing-library/jest-dom';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

describe('LoginPage', () => {
  it('deve exibir erros de validação ao tentar logar com campos vazios', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const loginButton = screen.getByRole('button', { name: /entrar/i });
    
    await user.click(loginButton);

    const errorMsg = await screen.findByText(/Insira um e-mail válido/i);
    
    expect(errorMsg).toBeInTheDocument();
  });
});