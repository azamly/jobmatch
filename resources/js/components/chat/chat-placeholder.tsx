import { motion, Variants } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { User } from '@/types';
import { Message } from '@/components/chat/chat-interface';




interface ChatPlaceholderProps {
    selectedUser: User | null|undefined;
    messages: Message[];
}

const ChatPlaceholder: React.FC<ChatPlaceholderProps> = ({ selectedUser, messages }) => {
    // Определяем текст и условия
    const isChatSelected = !!selectedUser;
    const hasMessages = messages.length > 0;
    const message = isChatSelected ? 'Сообщений пока нет' : 'Выберите чат для общения';

    // Если есть сообщения, ничего не рендерим
    if (hasMessages) return null;

    // Варианты анимации
    const containerVariants:Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    const iconVariants:Variants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 0.2,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full text-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={iconVariants}>
                <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground">{message}</h3>
            <p className="text-sm text-muted-foreground mt-2">
                {isChatSelected
                    ? 'Начните беседу, отправив первое сообщение!'
                    : 'Выберите пользователя из списка, чтобы начать чат.'}
            </p>
        </motion.div>
    );
};

export default ChatPlaceholder;
