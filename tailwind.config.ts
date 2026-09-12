import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.ts',
        './resources/**/*.tsx',
    ],
    // Указываем, что тема будет определена в CSS через @theme
    theme: {
        // Оставляем extend пустым, так как всё будет в CSS
    },
    // Плагины подключаются в CSS через @plugin
    plugins: [],
}

export default config
