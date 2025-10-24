"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by name or phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-12 w-full bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-accent/30 focus-visible:border-accent"
      />
    </div>
  );
};