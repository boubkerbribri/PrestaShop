#!/bin/bash

echo "* Preparing Apache ...";

sudo a2enmod rewrite actions fastcgi alias

# Use default config
sudo cp -f tests/travis-ci-apache-vhost /etc/apache2/sites-available/000-default.conf
sudo sed -e "s?%TRAVIS_BUILD_DIR%?$(pwd)?g" --in-place /etc/apache2/sites-available/000-default.conf
sudo chmod 777 -R $HOME

apt install -y \
php7.4-zip \
php7.4-xml \
php7.4-curl \
php7.4-intl \
php7.4-mysql \
php7.4-gd \
php7.4-mbstring

# Starting Apache
sudo service apache2 restart
