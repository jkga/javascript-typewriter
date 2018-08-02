FROM webdevops/php-apache:ubuntu-16.04
RUN git clone https://github.com/jkga/javascript-typewriter.git
EXPOSE 80
EXPOSE 445
