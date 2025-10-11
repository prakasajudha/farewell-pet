import { LuCalendar1, LuCircuitBoard, LuSettings, LuClipboardList, LuCodesandbox, LuFileText, LuFingerprint, LuLayoutPanelLeft, LuLock, LuMail, LuMessagesSquare, LuMonitorDot, LuPackage, LuPictureInPicture2, LuShare2, LuShieldCheck, LuShoppingBag, LuSquareUserRound, LuTrophy } from 'react-icons/lu';

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

  // Admin-only menu items (for full admin)
  const adminMenuItems = [
    {
      key: 'Admin',
      label: 'Admin',
      isTitle: true
    },
    {
      key: 'Settings',
      label: 'Settings',
      icon: LuSettings,
      href: '/settings'
    }
  ];

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
      key: 'Settings',
      label: 'Settings',
      icon: LuSettings,
      href: '/settings'
    });
  }

  // Return menu items based on admin/semi-admin status
  if (isAdmin || isSemiAdmin) {
    return [...baseMenuItems, ...adminSemiAdminMenuItems];
  } else {
    return baseMenuItems;
  }
};

// Default export for backward compatibility
export const menuItemsData = getMenuItemsData(false);