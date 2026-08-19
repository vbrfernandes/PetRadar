export const theme = {
  colors: {
    // Brand e Fundos
    brand: '#1F5C4D',
    action: '#28A745',
    background: '#F5F6F8',
    surface: '#FFFFFF',

    // Tipografia
    textTitle: '#1A1A1A',
    textBody: '#666666',

    // UI Elements
    inputBg: '#F0F0F0',

    // Cores Semânticas
    semantic: {
      danger: {
        bg: 'rgba(235, 87, 87, 0.15)',
        text: '#EB5757',
      },
      warning: {
        bg: 'rgba(242, 201, 76, 0.15)',
        text: '#B8860B',
      },
      success: {
        bg: 'rgba(39, 174, 96, 0.15)',
        text: '#27AE60',
      }
    }
  },

  shadows: {
    elevation1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
    },

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
    image: 20,
    button: 100,
  }
} as const;

export type Theme = typeof theme;