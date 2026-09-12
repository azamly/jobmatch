import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, BriefcaseBusiness, BriefcaseMedical } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}
export default function AuthSplitCardLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden p-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <div className="p-6 md:p-6 flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-xl font-bold">{title}</h1>
                                        <p className="text-muted-foreground text-balance">
                                            {description}
                                        </p>
                                    </div>
                                    <div>
                                        {children}
                                    </div>
                                </div>
                                <div className="bg-muted relative hidden md:block">
                                    <Briefcase className="w-16 h-16 text-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                        <div
                            className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                            and <a href="#">Privacy Policy</a>.
                        </div>
                        </div>
                </div>
            </div>
        </>
    )
}
