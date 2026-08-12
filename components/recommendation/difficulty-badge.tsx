import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface DifficultyBadgeProps {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number; // 1 - 5
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, rating = 1 }) => {
  const variantMap = {
    Beginner: 'success' as const,
    Intermediate: 'warning' as const,
    Advanced: 'purple' as const,
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge variant={variantMap[difficulty]}>
        ● {difficulty}
      </Badge>
      {rating && (
        <div className="flex items-center gap-0.5 text-amber-400 text-xs" title={`Estimated difficulty rating: ${rating}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
