
"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
 const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

//   return (
//     <div className="flex items-center justify-center gap-2">
//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="h-10 w-10"
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </Button>

//       {visiblePages.map((page, index) => (
//         <Button
//           key={index}
//           variant={page === currentPage ? 'default' : 'outline'}
//           size="icon"
//           onClick={() => typeof page === 'number' && onPageChange(page)}
//           disabled={typeof page !== 'number'}
//           className="h-10 w-10"
//         >
//           {page}
//         </Button>
//       ))}

//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="h-10 w-10"
//       >
//         <ChevronRight className="w-4 h-4" />
//       </Button>
//     </div>
//   );

 return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 border-border hover:bg-secondary/50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <Button
          key={index}
          variant={currentPage === page ? "default" : "outline"}
          className={`h-10 w-10 border-border ${
            currentPage === page
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "hover:bg-secondary/50"
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 border-border hover:bg-secondary/50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};