import AppLogoIcon from './app-logo-icon';
import { Briefcase } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            {/*<Link href="/dashboard" prefetch className="flex items-center gap-3">*/}
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Jobmatch</span>
                </div>
            {/*</Link>*/}
        </>
    );
}
