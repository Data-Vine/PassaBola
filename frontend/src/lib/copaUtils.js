/**
 * Utilitário para gerar rotas da Copa
 * Uso fora do módulo Copa: toCopa('registration') -> '/copa/registration'
 * Dentro do módulo Copa, prefira usar rotas relativas diretamente
 */
export const toCopa = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `/copa/${cleanPath}`;
};

/**
 * Helper para caminhos absolutos da Copa (usado no header)
 * Mesmo comportamento que toCopa, mas nome mais específico
 */
export const copaPath = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `/copa/${cleanPath}`;
};

/**
 * Verifica se estamos no contexto da Copa
 */
export const isCopaContext = (location) => {
  return location?.pathname?.startsWith('/copa');
};

export default { toCopa, copaPath, isCopaContext };