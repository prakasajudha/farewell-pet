import { LuCalendar1, LuCircuitBoard, LuSettings, LuClipboardList, LuCodesandbox, LuFileText, LuFingerprint, LuLayoutPanelLeft, LuLock, LuMail, LuMessagesSquare, LuMonitorDot, LuPackage, LuPictureInPicture2, LuShare2, LuShieldCheck, LuShoppingBag, LuSquareUserRound, LuTrophy, LuUserPlus } from 'react-icons/lu';

// Function to get menu items based on user admin status and configurations
export const getMenuItemsData = (isAdmin = false, isSemiAdmin = false, configurations = {}) => {
  const baseMenuItems = [
    {
      key: 'FITUR UTAMA',
      label: 'FITUR UTAMA',
      isTitle: true
    },
    {
      key: 'Message',
      label: 'Message',
      icon: LuMessagesSquare,
      href: '/message'
    }
  ];

  // Add Leaderboard menu if feature is enabled
  if (configurations.SHOW_LEADER_BOARD) {
    baseMenuItems.push({
      key: 'Leaderboard',
      label: 'Leaderboard',
      icon: LuTrophy,
      href: '/leaderboard'
    });
  }

  // Admin/Semi-admin menu items (for both admin and semi-admin)
  const adminSemiAdminMenuItems = [
    {
      key: 'Admin',
      label: 'Admin',
      isTitle: true
    },
    {
      key: 'BestMessage',
      label: 'Best Message',
      icon: LuMessagesSquare,
      href: '/message/list-favorite'
    }
  ];

  // Add Settings only for full admin
  if (isAdmin) {
    adminSemiAdminMenuItems.push({
      key: 'RegisterUser',
      label: 'Register User',
      icon: LuUserPlus,
      href: '/register-user'
    });
    adminSemiAdminMenuItems.push({
      key: 'Settings',
      label: 'Settings',
      icon: LuSettings,
      href: '/settings'
    });

  }

  // Return menu items based on admin/semi-admin status
  if (isAdmin) {
    // Full admin gets both admin-only and admin/semi-admin items
    return [...baseMenuItems, ...adminSemiAdminMenuItems];
  } else if (isSemiAdmin) {
    // Semi-admin gets only admin/semi-admin items
    return [...baseMenuItems, ...adminSemiAdminMenuItems];
  } else {
    return baseMenuItems;
  }
};

// Default export for backward compatibility
export const menuItemsData = getMenuItemsData(false);