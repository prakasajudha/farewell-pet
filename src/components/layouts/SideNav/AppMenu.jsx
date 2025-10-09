import { Link, useLocation } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';
import { getMenuItemsData } from './menu';
import { useState, useEffect } from 'react';
const isItemActive = (item, pathname) => {
  if (item.href && pathname === item.href) return true;
  if (item.children) {
    return item.children.some(child => isItemActive(child, pathname));
  }
  return false;
};
const MenuItemWithChildren = ({
  item
}) => {
  const {
    pathname
  } = useLocation();
  const Icon = item.icon;
  const isActive = isItemActive(item, pathname);
  return <li className={`menu-item hs-accordion ${isActive ? 'active' : ''}`}>
    <button className={`hs-accordion-toggle menu-link ${isActive ? 'active' : ''}`}>
      {Icon && <span className="menu-icon">
        <Icon />
      </span>}
      <span className="menu-text">{item.label}</span>
      <span className="menu-arrow">
        <LuChevronRight />
      </span>
    </button>

    <ul className={`sub-menu hs-accordion-content hs-accordion-group ${isActive ? 'block' : 'hidden'}`}>
      {item.children?.map(child => child.children ? <MenuItemWithChildren key={child.key} item={child} /> : <MenuItem key={child.key} item={child} />)}
    </ul>
  </li>;
};
const MenuItem = ({
  item
}) => {
  const {
    pathname
  } = useLocation();
  const Icon = item.icon;
  const isActive = pathname === item.href;
  return <li className={`menu-item ${isActive ? 'active' : ''}`}>
    <Link to={item.href ?? '#'} className={`menu-link ${isActive ? 'active' : ''}`}>
      {Icon && <span className="menu-icon">
        <Icon />
      </span>}
      <div className="menu-text">{item.label}</div>
    </Link>
  </li>;
};
const AppMenu = () => {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Get menu items based on admin status
        const isAdmin = parsedUser.is_admin || false;
        const items = getMenuItemsData(isAdmin);
        setMenuItems(items);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to non-admin menu
        setMenuItems(getMenuItemsData(false));
      }
    } else {
      // No user data, show non-admin menu
      setMenuItems(getMenuItemsData(false));
    }
  }, []);

  return <ul className="side-nav p-3 hs-accordion-group">
    {menuItems.map(item => item.isTitle ? <li className="menu-title" key={item.key}>
      <span>{item.label}</span>
    </li> : item.children ? <MenuItemWithChildren key={item.key} item={item} /> : <MenuItem key={item.key} item={item} />)}
  </ul>;
};
export default AppMenu;