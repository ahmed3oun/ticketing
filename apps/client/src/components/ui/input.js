const { cn } = require("@/lib/utils");


const Input = ({ className, type, ...props}, ref) => (
    <input
        type={type}
        className={cn(
            'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500',
            className
        )}
        ref={ref}
        {...props}
    />
);

Input.displayName = 'Input';

export { Input };
// Usage example:
// import { Input } from '@/components/ui/input';
//
// <Input type="text" placeholder="Enter text here" className="my-custom-class" />
