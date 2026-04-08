// components/ui/Card.tsx
import { cn } from '@/lib/utils/cn';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl border border-gray-200 shadow-sm',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 border-b border-gray-100 pb-3', className)} {...props} />
);

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props} />
);

const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
);

// Export both named and default for flexibility
export { Card, CardHeader, CardTitle, CardContent };
export default Card;