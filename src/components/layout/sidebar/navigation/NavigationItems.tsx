
import React, { memo, useMemo } from "react";
import { NavigationItemWithSub } from "./NavigationItemWithSub";
import { NavigationItem } from "./NavigationItem";
import { getNavigationItems } from "./navigationData";
import { SidebarSeparator } from "@/components/ui/sidebar";

interface NavigationItemsProps {
  isActive: (href: string) => boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = memo(({ isActive }) => {
  // Memoize navigation items to prevent unnecessary recalculation
  const navigation = useMemo(() => getNavigationItems(), []);
  
  // Group items by section
  const groupedItems = useMemo(() => {
    const grouped = navigation.reduce((acc, item) => {
      const section = item.section || 'other';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {} as Record<string, typeof navigation>);
    
    // Define the order of sections
    const sectionOrder = ['main', 'content-pipeline', 'source-materials', 'strategy', 'examples', 'settings', 'other'];
    
    return sectionOrder
      .filter(section => grouped[section]?.length > 0)
      .map(section => ({
        section,
        items: grouped[section]
      }));
  }, [navigation]);
  
  return (
    <>
      {groupedItems.map(({ section, items }, groupIndex) => (
        <React.Fragment key={`section-${section}`}>
          {groupIndex > 0 && <SidebarSeparator className="my-2" />}
          
          {items.map((item, index) => {
            // Create a stable, unique key for each navigation item
            const key = `nav-item-${section}-${index}-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
            
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
        </React.Fragment>
      ))}
    </>
  );
});

NavigationItems.displayName = "NavigationItems";
