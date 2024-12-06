import React, { useState, useEffect } from 'react';
import { calcularTempoDecorrido } from '../../utils/tempo';

interface TempoDecorridoProps {
  inicio: Date;
  className?: string;
}

export function TempoDecorrido({ inicio, className = '' }: TempoDecorridoProps) {
  const [tempoDecorrido, setTempoDecorrido] = useState(calcularTempoDecorrido(inicio));

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoDecorrido(calcularTempoDecorrido(inicio));
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(timer);
  }, [inicio]);

  return (
    <span className={`text-sm ${className}`} title={inicio.toLocaleString()}>
      {tempoDecorrido}
    </span>
  );
}