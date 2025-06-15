'use client';


const labelVariant = cva(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    {
        variants: {
            variant: {
                default: 'text-gray-700 dark:text-gray-300',
                primary: 'text-blue-600 dark:text-blue-400',
                secondary: 'text-gray-500 dark:text-gray-400',
            },
            size: {
                default: 'text-base',
                sm: 'text-sm',
                lg: 'text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const Label = ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        className={cn(labelVariant(), className)}
        ref={ref}
        {...props}
    />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariant };


