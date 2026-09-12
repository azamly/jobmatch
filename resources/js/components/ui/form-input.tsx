import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface FormInputProps extends ComponentProps<typeof Input> {
    label?: string;
    error?: string;
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                    {label}
                </label>
            )}
            <Input
                className={cn(
                    error && 'border-red-500 focus-visible:ring-red-500/50',
                    className
                )}
                aria-invalid={!!error}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
