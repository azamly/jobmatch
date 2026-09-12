import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, User } from '@/types';
import { useState } from 'react';
import ChatInterface from '@/components/chat/chat-interface';
import UserSidebar from '@/components/chat/user-sidebar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Чат', href: '/chat' },
];

export default function ChatPage({ users }: { users: User[] }) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Чат" />
            <div className="flex h-screen overflow-hidden"> {/* Full viewport height, no page scroll */}
                {/* Sidebar */}
                <UserSidebar
                    users={users}
                    onSelectUser={setSelectedUser}
                    selectedUser={selectedUser}
                />

                {/* Chat Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden"> {/* Full height, no overflow */}
                    <div className="w-full h-full shadow-xl rounded-xl flex flex-col">
                        <ChatInterface selectedUser={selectedUser} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
