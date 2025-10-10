import { LuCalendar1, LuCircuitBoard, LuSettings, LuClipboardList, LuCodesandbox, LuFileText, LuFingerprint, LuLayoutPanelLeft, LuLock, LuMail, LuMessagesSquare, LuMonitorDot, LuPackage, LuPictureInPicture2, LuShare2, LuShieldCheck, LuShoppingBag, LuSquareUserRound, LuTrophy } from 'react-icons/lu';

// Function to get menu items based on user admin status and configurations
export const getMenuItemsData = (isAdmin = false, configurations = {}) => {
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

  // Admin-only menu items
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

  // Return menu items based on admin status
  if (isAdmin) {
    return [...baseMenuItems, ...adminMenuItems];
  } else {
    return baseMenuItems;
  }
};

// Default export for backward compatibility
export const menuItemsData = getMenuItemsData(false);