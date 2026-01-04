import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

// Color scheme
const GREEN_PRIMARY = '#2E7D32';
const GREEN_SECONDARY = '#43A047';
const GREEN_LIGHT = '#E8F5E9';
const GREEN_LIGHTER = '#C8E6C9';
const WHITE = '#fff';
const GRAY_LIGHT = '#F5F5F5';
const GRAY_BORDER = '#E0E0E0';
const GRAY_TEXT = '#666666';
const ERROR_COLOR = '#F44336';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // Avatar Bar
  avatarBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: GREEN_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: GREEN_LIGHTER,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: GREEN_SECONDARY,
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: GREEN_PRIMARY,
  },
  userPhone: {
    fontSize: 12,
    color: GRAY_TEXT,
    fontWeight: '500',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: GREEN_LIGHTER,
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  headerSection: {
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: GREEN_LIGHTER,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: '700',
    color: GREEN_PRIMARY,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: GRAY_TEXT,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  // Booking Summary Card
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: GREEN_SECONDARY,
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: GREEN_LIGHT,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN_PRIMARY,
  },
  summaryBadge: {
    backgroundColor: GREEN_SECONDARY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: WHITE,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 10,
  },
  summaryTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: GRAY_TEXT,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN_PRIMARY,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: GREEN_LIGHT,
    marginVertical: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailBox: {
    flex: 1,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GREEN_LIGHTER,
  },
  detailLabel: {
    fontSize: 11,
    color: GRAY_TEXT,
    fontWeight: '600',
    marginTop: 6,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: GREEN_PRIMARY,
    marginTop: 2,
    textAlign: 'center',
  },

  // Section Card
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GREEN_LIGHTER,
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: GREEN_LIGHT,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN_PRIMARY,
    marginLeft: 10,
  },

  // Input Group
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: GREEN_PRIMARY,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: GREEN_LIGHTER,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    color: GREEN_PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  inputError: {
    borderColor: ERROR_COLOR,
    borderWidth: 2,
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    fontSize: 12,
    color: ERROR_COLOR,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Price Card
  priceCard: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: GREEN_PRIMARY,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY_TEXT,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: GREEN_PRIMARY,
  },
  priceDivider: {
    height: 1.5,
    backgroundColor: GREEN_LIGHTER,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN_PRIMARY,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN_PRIMARY,
  },

  // Confirm Button
  confirmButton: {
    marginHorizontal: 0,
    marginBottom: 16,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: GREEN_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  confirmButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 20,
  },
});
