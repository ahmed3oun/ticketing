import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-gray-900 text-gray-50 hover:bg-gray-900/90',
                destructive: 'bg-red-500 text-gray-50 hover:bg-red-500/90',
                outline:
                    'border border-gray-200 00 bg-white hover:bg-gray-100 hover:text-gray-900',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
                ghost: 'hover:bg-gray-100 hover:text-gray-900',
                link: 'text-gray-900 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);


const Button = ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}
Button.displayName = 'Button';
export { Button, buttonVariants };
// Usage example:
// import { Button } from '@/components/ui/button';
//
// <Button variant="primary" size="lg" onClick={() => alert('Clicked!')}>
//   Click Me
// </Button>
//
