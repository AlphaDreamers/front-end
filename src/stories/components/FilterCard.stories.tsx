import type { Meta, StoryObj } from "@storybook/react";
import FilterCard from "@/components/FilterCard";
import { addDays } from "date-fns";

const meta: Meta<typeof FilterCard> = {
  component: FilterCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterCard>;

// Define a base date for date examples
const today = new Date();
const yesterday = addDays(today, -1);
const nextWeek = addDays(today, 7);
const nextMonth = addDays(today, 30);

export const AllFilters: Story = {
  args: {
    config: [
      {
        type: "slider",
        id: "price",
        label: "Price",
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        type: "combobox",
        id: "category",
        label: "Category",
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
          { value: "books", label: "Books" },
          { value: "furniture", label: "Furniture" },
        ],
      },
      {
        type: "multicombobox",
        id: "tags",
        label: "Tags",
        options: [
          { value: "new", label: "New" },
          { value: "sale", label: "Sale" },
          { value: "featured", label: "Featured" },
          { value: "trending", label: "Trending" },
        ],
      },
      {
        type: "switch",
        id: "inStock",
        label: "In Stock",
      },
      {
        type: "checkbox",
        id: "sizes",
        label: "Sizes",
        options: [
          { value: "s", label: "Small" },
          { value: "m", label: "Medium" },
          { value: "l", label: "Large" },
          { value: "xl", label: "Extra Large" },
        ],
      },
      {
        type: "radio",
        id: "sortBy",
        label: "Sort By",
        options: [
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "newest", label: "Newest First" },
          { value: "rating", label: "Highest Rated" },
        ],
      },
      {
        type: "date",
        id: "releaseDate",
        label: "Release Date",
        min: yesterday,
        max: nextMonth,
      },
      {
        type: "daterange",
        id: "dateRange",
        label: "Date Range",
        min: yesterday,
        max: nextMonth,
      },
    ],
  },
};

export const PriceFilter: Story = {
  args: {
    config: [
      {
        type: "slider",
        id: "price",
        label: "Price",
        min: 0,
        max: 1000,
        step: 10,
      },
    ],
  },
};

export const CategoryFilter: Story = {
  args: {
    config: [
      {
        type: "combobox",
        id: "category",
        label: "Category",
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
          { value: "books", label: "Books" },
          { value: "furniture", label: "Furniture" },
        ],
      },
    ],
  },
};

export const MultiSelectFilter: Story = {
  args: {
    config: [
      {
        type: "multicombobox",
        id: "tags",
        label: "Tags",
        options: [
          { value: "new", label: "New" },
          { value: "sale", label: "Sale" },
          { value: "featured", label: "Featured" },
          { value: "trending", label: "Trending" },
        ],
      },
    ],
  },
};

export const ToggleFilter: Story = {
  args: {
    config: [
      {
        type: "switch",
        id: "inStock",
        label: "In Stock",
      },
    ],
  },
};

export const CheckboxGroupFilter: Story = {
  args: {
    config: [
      {
        type: "checkbox",
        id: "sizes",
        label: "Sizes",
        options: [
          { value: "s", label: "Small" },
          { value: "m", label: "Medium" },
          { value: "l", label: "Large" },
          { value: "xl", label: "Extra Large" },
        ],
      },
    ],
  },
};

export const RadioGroupFilter: Story = {
  args: {
    config: [
      {
        type: "radio",
        id: "sortBy",
        label: "Sort By",
        options: [
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "newest", label: "Newest First" },
          { value: "rating", label: "Highest Rated" },
        ],
      },
    ],
  },
};

export const DateFilter: Story = {
  args: {
    config: [
      {
        type: "date",
        id: "releaseDate",
        label: "Release Date",
        min: yesterday,
        max: nextMonth,
      },
    ],
  },
};

export const DateRangeFilter: Story = {
  args: {
    config: [
      {
        type: "daterange",
        id: "dateRange",
        label: "Date Range",
        min: yesterday,
        max: nextMonth,
      },
    ],
  },
};

export const ProductFilters: Story = {
  args: {
    config: [
      {
        type: "slider",
        id: "price",
        label: "Price",
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        type: "combobox",
        id: "category",
        label: "Category",
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
          { value: "books", label: "Books" },
        ],
      },
      {
        type: "switch",
        id: "inStock",
        label: "In Stock",
      },
      {
        type: "radio",
        id: "sortBy",
        label: "Sort By",
        options: [
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "newest", label: "Newest First" },
        ],
      },
    ],
  },
};

export const EventFilters: Story = {
  args: {
    config: [
      {
        type: "daterange",
        id: "eventDate",
        label: "Event Date",
        min: yesterday,
        max: nextMonth,
      },
      {
        type: "multicombobox",
        id: "eventType",
        label: "Event Type",
        options: [
          { value: "conference", label: "Conference" },
          { value: "workshop", label: "Workshop" },
          { value: "seminar", label: "Seminar" },
          { value: "networking", label: "Networking" },
        ],
      },
      {
        type: "checkbox",
        id: "location",
        label: "Location",
        options: [
          { value: "online", label: "Online" },
          { value: "in-person", label: "In Person" },
        ],
      },
    ],
  },
};
