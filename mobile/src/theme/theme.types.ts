import type { colors } from './colors';
import type { radius } from './radius';
import type { shadows } from './shadows';
import type { spacing } from './spacing';
import type { typography } from './typography';

export interface Theme {
  colors: typeof colors;
  radius: typeof radius;
  shadows: typeof shadows;
  spacing: typeof spacing;
  typography: typeof typography;
}
