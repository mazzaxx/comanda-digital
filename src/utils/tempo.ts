export const formatarHora = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calcularTempoDecorrido = (inicio: Date, fim: Date = new Date()): string => {
  const diffMs = fim.getTime() - inicio.getTime();
  const diffMinutos = Math.floor(diffMs / 1000 / 60);
  
  if (diffMinutos < 1) return 'Agora mesmo';
  if (diffMinutos === 1) return '1 minuto';
  if (diffMinutos < 60) return `${diffMinutos} minutos`;
  
  const horas = Math.floor(diffMinutos / 60);
  const minutos = diffMinutos % 60;
  
  if (horas === 1) {
    return minutos > 0 ? `1 hora e ${minutos} min` : '1 hora';
  }
  
  return minutos > 0 ? `${horas} horas e ${minutos} min` : `${horas} horas`;
};

export const obterUltimaAtualizacao = (registros: { timestamp: Date }[]): Date => {
  if (registros.length === 0) return new Date();
  return new Date(Math.max(...registros.map(r => r.timestamp.getTime())));
};