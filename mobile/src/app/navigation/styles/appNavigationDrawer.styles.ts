import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

export const appNavigationDrawerStyles = StyleSheet.create({
  drawerRoot: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 90,
  },

  drawerOverlay: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(10,24,20,0.48)',

    zIndex: 90,
  },

  drawerTouchableArea: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 91,
  },

  drawer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: 0,

    backgroundColor: theme.colors.background,

    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,

    overflow: 'hidden',

    zIndex: 100,

    ...theme.shadows.elevation1,
  },

  drawerSafeArea: {
    flex: 1,
  },

  drawerContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 4,

    marginBottom: 18,
  },

  drawerBrandIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: theme.colors.brand,
  },

  drawerBrandContent: {
    marginLeft: 11,

    flex: 1,
  },

  drawerBrandTitle: {
    fontSize: 17,
    fontWeight: '900',

    color: theme.colors.textTitle,
  },

  drawerBrandSubtitle: {
    marginTop: 1,

    fontSize: 10,

    color: theme.colors.textBody,
  },

  drawerClose: {
    width: 38,
    height: 38,

    borderRadius: 13,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: theme.colors.surface,
  },

  drawerUserCard: {
    minHeight: 70,

    flexDirection: 'row',
    alignItems: 'center',

    padding: 10,

    borderRadius: 18,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  drawerAvatar: {
    width: 46,
    height: 46,

    borderRadius: 15,
  },

  drawerUserInfo: {
    flex: 1,

    marginLeft: 10,
  },

  drawerUserName: {
    fontSize: 12,
    fontWeight: '800',

    color: theme.colors.textTitle,
  },

  drawerUserEmail: {
    marginTop: 3,

    fontSize: 10,

    color: theme.colors.textBody,
  },

  drawerUserStatus: {
    width: 9,
    height: 9,

    borderRadius: 5,

    backgroundColor: theme.colors.semantic.success.text,
  },

  drawerSectionTitle: {
    marginTop: 25,
    marginBottom: 9,

    paddingHorizontal: 10,

    fontSize: 9,
    fontWeight: '900',

    letterSpacing: 1,

    color: theme.colors.textBody,
  },

  drawerDivider: {
    height: 1,

    marginVertical: 12,

    backgroundColor: theme.colors.inputBg,
  },

  drawerItem: {
    minHeight: 49,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 7,

    borderRadius: 15,

    marginBottom: 3,
  },

  drawerItemActive: {
    backgroundColor: theme.colors.semantic.success.bg,
  },

  drawerItemPressed: {
    backgroundColor: theme.colors.inputBg,
  },

  drawerItemIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },

  drawerItemIconActive: {
    backgroundColor: theme.colors.surface,
  },

  drawerItemText: {
    marginLeft: 8,

    fontSize: 13,
    fontWeight: '600',

    color: theme.colors.textTitle,
  },

  drawerItemTextActive: {
    fontWeight: '800',

    color: theme.colors.brand,
  },

  drawerActiveIndicator: {
    width: 4,
    height: 20,

    borderRadius: 2,

    marginLeft: 'auto',

    backgroundColor: theme.colors.brand,
  },

  sosCard: {
    minHeight: 66,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,

    marginTop: 24,

    borderRadius: 18,

    borderWidth: 1,

    borderColor: theme.colors.semantic.danger.bg,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  sosIcon: {
    width: 39,
    height: 39,

    borderRadius: 13,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: theme.colors.surface,
  },

  sosContent: {
    flex: 1,

    marginLeft: 10,
  },

  sosTitle: {
    fontSize: 12,
    fontWeight: '800',

    color: theme.colors.semantic.danger.text,
  },

  sosDescription: {
    marginTop: 2,

    fontSize: 9,

    color: theme.colors.textBody,
  },
});
