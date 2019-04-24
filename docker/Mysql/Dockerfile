FROM mysql:5.7.19
WORKDIR /home
EXPOSE 3306
COPY mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf
RUN echo 'Europe/Paris' > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

#RUN mysql -u root -proot -e "use mysql;CREATE USER 'bercail'@'%' IDENTIFIED BY 'bercail';GRANT ALL ON . TO 'myuser'@'%';flush privileges;"
RUN /etc/init.d/mysql start && \
    mysql -u root -proot -e "use mysql;" && \
    mysql -u root -proot -e "CREATE USER 'bercail'@'%' IDENTIFIED BY 'bercail';" && \
    mysql -u root -proot -e "GRANT ALL ON *.* TO 'bercail'@'%';" && \
    mysql -u root -proot -e "flush privileges;" && \
    mysql -u root -proot -e "CREATE DATABASE bercail;" && \
    /etc/init.d/mysql stop
    CMD /etc/init.d/mysql start && \
    tail -f /dev/null
