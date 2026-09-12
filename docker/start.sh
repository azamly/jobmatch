#!/bin/bash
set -e

# Запуск PHP-FPM в фоне
php-fpm -D

# Ожидание доступности БД
echo "Waiting for database..."
sleep 5

# Выполнение миграций
php artisan migrate --force

# Очистка старого кэша
php artisan config:clear
php artisan cache:clear

# Кэширование конфигурации
php artisan config:cache
php artisan route:cache
php artisan view:cache


# Запуск Nginx
nginx -g 'daemon off;'
