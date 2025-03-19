
import React, { memo, useMemo } from "react";
import { NavigationItemWithSub } from "./NavigationItemWithSub";
import { NavigationItem } from "./NavigationItem";
import { getNavigationItems } from "./navigationData";

interface NavigationItemsProps {
  isActive: (href: string) => boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = memo(({ isActive }) => {
  // Memoize navigation items to prevent unnecessary recalculation
  const navigation = useMemo(() => getNavigationItems(), []);

  return (
    <>
      {navigation.map((item, index) => {
        // Create a stable, unique key for each navigation item
        const key = `nav-item-${index}-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
        
        if (item.subItems) {
          return (
            <NavigationItemWithSub 
              key={`${key}-with-sub`}
              item={item} 
              isActive={isActive} 
            />
          );
        }

        return (
          <NavigationItem 
            key={key}
            item={item} 
            isActive={isActive} 
          />
        );
      })}
    </>
  );
});

NavigationItems.displayName = "NavigationItems";
