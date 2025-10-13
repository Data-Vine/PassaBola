import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 mb-6">
              Houve um erro inesperado. Recarregue a página ou tente novamente mais tarde.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;