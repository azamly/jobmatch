#!/bin/bash
set -e

# Запуск PHP-FPM в фоне
php-fpm -D

# Ожидание доступности БД
echo "Waiting for database..."
sleep 5

# Выполнение миграций
php artisan migrate --force

# Создание обязательных справочных данных (безопасно при повторном деплое)
php artisan db:seed --class=RoleSeeder --force
php artisan db:seed --class=IndustrySeeder --force
php artisan db:seed --class=AdditionCategorySeeder --force
php artisan db:seed --class=LanguageProficiencySeeder --force

# Очистка старого кэша
php artisan config:clear
php artisan cache:clear

# Кэширование конфигурации
php artisan config:cache
php artisan route:cache
php artisan view:cache


# Запуск Nginx
nginx -g 'daemon off;'
