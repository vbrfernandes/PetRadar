export const colors = {
    // Brand e Fundos
    brand: '#1F5C4D',
    brandSoft: '#E8F5E9',

    action: '#28A745',
    accent: '#10B981',
    accentSoft: '#E6F4EA',

    background: '#F5F6F8',
    backgroundSoft: '#F4F7F6',

    surface: '#FFFFFF',
    surfaceSoft: '#F8FAFC',

    // Tipografia
    textTitle: '#1A1A1A',
    textBody: '#666666',
    muted: '#94A3B8',
    placeholder: '#A0AEC0',

    // Elementos de interface
    inputBg: '#F0F0F0',
    border: '#E2E8F0',
    disabled: '#CBD5E1',
    shadow: '#000000',

    borderAlpha: {
      card: 'rgba(0, 0, 0, 0.03)',
      default: 'rgba(15, 23, 42, 0.07)',
      subtle: 'rgba(15, 23, 42, 0.055)',
      faint: 'rgba(15, 23, 42, 0.06)',
    },

    brandAlpha: {
      faint: 'rgba(31, 92, 77, 0.065)',
      soft: 'rgba(31, 92, 77, 0.08)',
      medium: 'rgba(31, 92, 77, 0.10)',
      border: 'rgba(31, 92, 77, 0.14)',
      strongBorder: 'rgba(31, 92, 77, 0.20)',
    },

    overlay: {
      modal: 'rgba(15, 23, 42, 0.56)',
      modalStrong: 'rgba(15, 23, 42, 0.58)',
      image: 'rgba(15, 23, 42, 0.24)',
    },

    mutedSurface: 'rgba(15, 23, 42, 0.028)',

    // Cores semânticas
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
      },
    },
} as const;
