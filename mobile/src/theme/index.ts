import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

import type { Theme } from './theme.types';

export const theme: Theme = {
  colors,
  shadows,
  spacing,
  radius,
  typography,
};

export { colors, radius, shadows, spacing, typography };
export type { Theme } from './theme.types';
