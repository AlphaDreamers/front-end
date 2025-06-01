"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";

interface Category {
  label: string;
  id: string;
  children?: Category[];
}

const CategoryItem = ({
  item,
  depth = 0,
}: {
  item: Category;
  depth?: number;
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  const MenuItem = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem;
  const MenuButton = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton;
  const MenuSub = SidebarMenuSub;

  return (
    <Collapsible className="group/collapsible" open={open}>
      <MenuItem>
        <CollapsibleTrigger asChild>
          <MenuButton>
            <Link
              className="min-w-0 flex-1 truncate mr-2"
              href={`/gigs?category=${item.id}`}
            >
              {item.label}
            </Link>

            {hasChildren && (
              <button
                className="flex-shrink-0"
                onClick={() => {
                  setOpen((prev) => !prev);
                }}
              >
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform duration-100",
                    open ? "rotate-90" : "-rotate-90"
                  )}
                />
              </button>
            )}
          </MenuButton>
        </CollapsibleTrigger>

        {hasChildren && (
          <CollapsibleContent>
            <MenuSub>
              {item.children?.map((childItem) => (
                <CategoryItem
                  key={childItem.label}
                  item={childItem}
                  depth={depth + 1}
                />
              ))}
            </MenuSub>
          </CollapsibleContent>
        )}
      </MenuItem>
    </Collapsible>
  );
};

export default CategoryItem;
