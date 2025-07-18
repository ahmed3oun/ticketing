import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80',
                secondary:
                    'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80',
                destructive:
                    'border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80',
                outline: 'text-gray-950',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);


const Badge = ({ className, variant, ...props }) => (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
)

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
// Usage example:
// import { Badge } from '@/components/ui/badge';
//
// <Badge variant="secondary">New</Badge>
// <Badge variant="destructive">Error</Badge>
// <Badge variant="outline">Info</Badge>
// <Badge variant="default">Default</Badge>
//