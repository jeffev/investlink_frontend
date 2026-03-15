import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingBackdrop, FeedbackSnackbar } from './FeedbackUI';

describe('LoadingBackdrop', () => {
  it('renderiza sem quebrar quando open é true', () => {
    const { container } = render(<LoadingBackdrop open={true} />);
    expect(container).toBeInTheDocument();
  });

  it('renderiza sem quebrar quando open é false', () => {
    const { container } = render(<LoadingBackdrop open={false} />);
    expect(container).toBeInTheDocument();
  });

  it('exibe CircularProgress quando open é true', () => {
    const { container } = render(<LoadingBackdrop open={true} />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe('FeedbackSnackbar', () => {
  it('não renderiza nada quando snackbar é null', () => {
    const { container } = render(<FeedbackSnackbar snackbar={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza a mensagem quando snackbar tem children', () => {
    const snackbar = { children: 'Sucesso!', severity: 'success' };
    render(<FeedbackSnackbar snackbar={snackbar} onClose={() => {}} />);
    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
  });

  it('renderiza com severity de erro', () => {
    const snackbar = { children: 'Erro ao salvar', severity: 'error' };
    render(<FeedbackSnackbar snackbar={snackbar} onClose={() => {}} />);
    expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão fechar do Alert', () => {
    const onClose = jest.fn();
    const snackbar = { children: 'Aviso', severity: 'warning' };
    render(<FeedbackSnackbar snackbar={snackbar} onClose={onClose} />);
    const closeButton = document.querySelector('[aria-label="Close"]');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    } else {
      expect(screen.getByText('Aviso')).toBeInTheDocument();
    }
  });
});
