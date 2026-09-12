import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip } from 'lucide-react';
import { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import ChatPlaceholder from '@/components/chat/chat-placeholder';

type Message = {
    id: number;
    body: string;
    sender_id: number;
    receiver_id: number;
    created_at: string;
};

type ChatInterfaceProps = {
    selectedUser?: User | null;
};

export default function ChatInterface({ selectedUser }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUserId = usePage<SharedData>().props.auth.user.id;

    useEffect(() => {
        if (selectedUser) {
            fetch(`/chat/conversation/${selectedUser.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setConversationId(data.conversation_id);
                    setMessages(data.messages);
                });
        } else {
            setMessages([]);
            setConversationId(null);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || !conversationId || !selectedUser) return;
        const res = await fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                receiver_id: selectedUser.id,
                body: inputValue,
            }),
        });
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full bg-background"> {/* Full height */}
            {/* Header */}
            {selectedUser && (
                <div className="flex items-center p-4 border-b shrink-0"> {/* Fixed height header */}
                    <Avatar className="h-8 w-8 overflow-hidden mr-2">
                        <AvatarImage
                            src={selectedUser.avatar ? `/storage/images/${selectedUser.avatar}` : undefined}
                            alt={selectedUser.name}
                        />
                        <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{selectedUser.name}</h2>
                    </div>
                </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4"> {/* Takes remaining height, scrollable */}
                <div className="flex flex-col space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                    message.sender_id === currentUserId
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-muted rounded-bl-none'
                                }`}
                            >
                                {message.body}
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <ChatPlaceholder messages={messages} selectedUser={selectedUser} />
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            {selectedUser && (
                <div className="p-4 border-t shrink-0"> {/* Fixed height input */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="pr-10 rounded-full"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            onClick={sendMessage}
                            size="icon"
                            className="rounded-full text-white"
                            disabled={inputValue.trim() === ''}
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
