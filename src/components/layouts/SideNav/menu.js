import { LuCalendar1, LuCircuitBoard, LuSettings, LuClipboardList, LuCodesandbox, LuFileText, LuFingerprint, LuLayoutPanelLeft, LuLock, LuMail, LuMessagesSquare, LuMonitorDot, LuPackage, LuPictureInPicture2, LuShare2, LuShieldCheck, LuShoppingBag, LuSquareUserRound } from 'react-icons/lu';

// Function to get menu items based on user admin status
export const getMenuItemsData = (isAdmin = false) => {
  const baseMenuItems = [
    {
      key: 'Fitur Utama',
      label: 'Fitur Utama',
      isTitle: true
    },
    {
      key: 'Message',
      label: 'Message',
      icon: LuMessagesSquare,
      href: '/message'
    }
  ];

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