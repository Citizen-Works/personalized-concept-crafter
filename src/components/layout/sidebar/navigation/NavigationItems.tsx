
import React, { memo } from "react";
import { NavigationItemWithSub } from "./NavigationItemWithSub";
import { NavigationItem } from "./NavigationItem";
import { getNavigationItems } from "./navigationData";

interface NavigationItemsProps {
  isActive: (href: string) => boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = memo(({ isActive }) => {
  const navigation = getNavigationItems();

  return (
    <>
      {navigation.map((item, index) => {
        if (item.subItems) {
          return (
            <NavigationItemWithSub 
              key={index} 
              item={item} 
              isActive={isActive} 
            />
          );
        }

        return (
          <NavigationItem 
            key={index} 
            item={item} 
            isActive={isActive} 
          />
        );
      })}
    </>
  );
});

NavigationItems.displayName = "NavigationItems";
