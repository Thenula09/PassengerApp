import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.background,
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 48,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },

  // Search Container
  searchContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    zIndex: 1000,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  iconColumn: {
    width: 30,
    alignItems: 'center',
    paddingTop: 15,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  connectLine: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  inputsColumn: {
    flex: 1,
  },

  // Autocomplete Styles
  autocompleteContainer: {
    flex: 0,
    zIndex: 1000,
  },
  autocompleteContainer2: {
    flex: 0,
    zIndex: 999,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontWeight: '500',
  },
  inputDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  listView: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 5,
    maxHeight: 300,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Place Row Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
    fontWeight: '500',
  },

  // Quick Links
  quickLinksContainer: {
    marginTop: 10,
  },
  quickLinksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 15,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  quickLinkIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Bottom Navigation
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingBottom: 15,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.6,
  },
  activeNavText: {
    color: COLORS.primary,
    fontWeight: '700',
    opacity: 1,
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
});

export default styles;
