"use client";

import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


interface FilterControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

const countries = [
  { code: 'all', name: 'All Countries' },
  { code: '+1', name: 'United States (+1)' },
  { code: '+44', name: 'United Kingdom (+44)' },
  { code: '+33', name: 'France (+33)' },
  { code: '+34', name: 'Spain (+34)' },
  { code: '+55', name: 'Brazil (+55)' },
  { code: '+82', name: 'South Korea (+82)' },
  { code: '+86', name: 'China (+86)' },
  { code: '+91', name: 'India (+91)' },
];

const sortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'updatedAt_desc', label: 'Recently Updated' },
];


export const FilterControls = ({
  sortBy,
  onSortChange,
  countryFilter,
  onCountryFilterChange,
  onReset,
  className
}: FilterControlsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="h-12 bg-background border-border hover:bg-secondary/50">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={countryFilter} onValueChange={onCountryFilterChange}>
        <SelectTrigger className="h-12 bg-background border-border hover:bg-secondary/50">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className={className}
      >
        Reset
      </Button>
    </div>
  );
};