export const theme = {
  colors: {
    // Brand e Fundos
    brand: '#1F5C4D',      // Verde Floresta Profundo
    action: '#28A745',     // Verde Esmeralda Vivo
    background: '#F5F6F8', // Cinza Off-white Quente
    surface: '#FFFFFF',    // Branco Puro
    
    // Tipografia
    textTitle: '#1A1A1A',  // Quase Preto (Títulos e Contadores)
    textBody: '#666666',   // Cinza Médio (Textos longos)
    
    // UI Elements
    inputBg: '#F0F0F0',    // Fundo de input translúcido
    
    // Cores Semânticas (Glassmorphism & Tags)
    // O fundo já utiliza rgba com 15% de opacidade direto no token para evitar 
    // o uso de `opacity` na View, o que deixaria o texto transparente também.
    semantic: {
      danger: {
        bg: 'rgba(235, 87, 87, 0.15)',
        text: '#EB5757', // SOS / Perdido
      },
      warning: {
        bg: 'rgba(242, 201, 76, 0.15)',
        text: '#B8860B', // Aviso / Avistado
      },
      success: {
        bg: 'rgba(39, 174, 96, 0.15)',
        text: '#27AE60', // Sucesso / Achado
      }
    }
  },
  
  shadows: {
    // Tactile Design: React Native não aceita múltiplas sombras nativamente em uma única View.
    // Esta configuração cria uma sombra de profundidade otimizada para iOS e a elevação correspondente no Android.
    elevation1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4, // Android shadow
    },
    // Sombras coloridas funcionam perfeitamente no iOS. 
    // No Android (antes da API 28), sombras coloridas ignoram a cor e ficam pretas. 
    // Para manter a consistência, garantimos a cor no iOS e uma elevação limpa no Android.
    buttonGlow: {
      shadowColor: '#1F5C4D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 8, 
    }
  },
  
  spacing: {
    globalMargin: 20,
    cardGap: 24,
    padding: 16,
  },
  
  radius: {
    card: 16,
    image: 20, // Nova regra do V2 para imagens em destaque
    button: 100, // Pill shape
  }
} as const;

// Opcional, mas recomendado: Exportar os tipos para uso com TypeScript e Styled-Components/Emotion
export type Theme = typeof theme;