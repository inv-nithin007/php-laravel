FROM php:8.3-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    libonig-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring dom xml

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Enable Apache mod_rewrite
RUN a2enmod rewrite

EXPOSE 80