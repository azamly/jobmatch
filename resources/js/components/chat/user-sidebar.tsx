import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import NoUsersPlaceholder from '@/components/chat/no-users-placeholder';
import { useInitials } from '@/hooks/use-initials';
import { ScrollArea } from '@/components/ui/scroll-area';

type UserSidebarProps = {
    users: User[];
    onSelectUser: (user: User) => void;
    selectedUser: User | null;
};

export default function UserSidebar({ users, onSelectUser, selectedUser }: UserSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const getInitials = useInitials();
    const usersArray: User[] = Array.isArray(users) ? users : Object.values(users) as User[];
    const filteredUsers = usersArray.filter((user: User) => {
        return user.name ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    });
    return (
        <div className="flex flex-col w-64 border-border bg-background">
            {/* Header / Search */}
            <div className="flex-shrink-0 border-b border-border p-4">
                <div className="relative">
                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Поиск пользователей..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="h-210">
                <div className="flex flex-col p-2 space-y-1">
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            className={`flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent ${
                                selectedUser?.id === user.id ? 'bg-accent' : ''
                            }`}
                            onClick={() => onSelectUser(user)}
                        >
                            <Avatar className="h-8 w-8 overflow-hidden">
                                <AvatarImage src={user.avatar ? `/storage/images/${user.avatar}` : undefined} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <span className="truncate font-medium">{user.name}</span>
                            </div>
                        </button>
                    ))}
                    {filteredUsers.length === 0 && <NoUsersPlaceholder />}
                </div>
            </ScrollArea>
        </div>
    );
}
