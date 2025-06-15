
import { cn } from '@/lib/utils';

const Card = (({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm',
            className,
        )}
        {...props}
    />
));
Card.displayName = 'Card';

const CardHeader = (({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = (({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'text-2xl font-semibold leading-none tracking-tight',
            className,
        )}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = (({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = (({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = (({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
// Usage example:
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
//
// <Card>
//   <CardHeader>
//     <CardTitle>Card Title</CardTitle>
//     <CardDescription>Card description goes here.</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <p>This is the content of the card.</p>
//   </CardContent>
//   <CardFooter>
//     <button className="btn btn-primary">Action</button>
//   </CardFooter>
// </Card>

// ------------------------------------------------------------------------------
// This code defines a set of React components for creating a card UI element with a header, title, description, content, and footer. The components use utility functions for styling and class management.
// The `Card` component serves as the main container, while `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` provide structured sections within the card. Each component accepts class names for customization and can be used to build a cohesive card layout in a React application.
// The components are designed to be flexible and reusable, allowing developers to easily create cards with different content and styles in their applications.
// The `cn` function is used to concatenate class names conditionally, ensuring that the components can be styled consistently with the rest of the UI.
// The `ref` prop is passed to each component to allow for direct DOM manipulation if needed, making these components suitable for integration with other libraries or frameworks that require access to the underlying DOM elements.
// The components are exported for use in other parts of the application, enabling developers to import and utilize them as needed.
// The code is structured to follow best practices in React development, promoting reusability and maintainability.
// The components can be easily extended or modified to fit specific design requirements, making them a versatile choice for building card-based interfaces in web applications.
// The usage example at the end demonstrates how to use these components together to create a complete card layout, showcasing their intended use in a practical scenario.