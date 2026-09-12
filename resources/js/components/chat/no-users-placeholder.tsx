import { motion, Variants } from 'framer-motion';
import { Users } from 'lucide-react';

const  NoUsersPlaceholder: React.FC = () => {
    // Варианты анимации
    const containerVariants: Variants = {
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

    const iconVariants: Variants = {
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
            className="flex flex-col items-center justify-center p-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={iconVariants}>
                <Users className="w-12 h-12 text-primary mb-4" />
            </motion.div>
            <p className="text-xs font-semibold text-primary uppercase">Пользователи не найдены</p>
            <p className="text-xs text-muted-foreground mt-2">Попробуйте изменить запрос поиска.</p>
        </motion.div>
    );
};

export default NoUsersPlaceholder;
