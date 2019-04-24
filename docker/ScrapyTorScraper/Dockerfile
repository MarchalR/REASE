FROM debian:stretch
ENV SCRAPER_STATUS false
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install tor curl wget -y
RUN apt-get install gcc -y
RUN apt-get install mongodb-clients -y
RUN apt-get install python-pip -y
RUN apt-get install python-dev python-pip libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev -y
RUN pip install pip --upgrade
RUN pip install scrapy
RUN pip install scrapy --upgrade
RUN pip install pymongo
RUN pip freeze > requirements.txt
RUN curl https://bootstrap.pypa.io/get-pip.py | python
RUN pip install scrapy
RUN pip install scrapyd
RUN apt-get install privoxy -y
RUN apt-get install nano -y
RUN apt-get install libcurl4-gnutls-dev librtmp-dev -y
RUN pip install pycurl
# RUN apt-get install git -y

WORKDIR /home
COPY immobot /home/immobot
RUN chmod 777 /home/immobot/cron/crontab
RUN chmod 777 /home/immobot/status
RUN mkdir /etc/scrapyd
COPY scrapyd.conf /etc/scrapyd/scrapyd.conf
WORKDIR /home/immobot
VOLUME /home/immobot

RUN chmod 777 /home/immobot/cron/scripts/check-ip.sh && \
    chmod 777 /home/immobot/cron/scripts/scrap.sh && \
    chmod +x /home/immobot/cron/scripts/check-ip.sh && \
    chmod +x /home/immobot/cron/scripts/scrap.sh && \
    chmod 777 /home/immobot/cron/crontab && \
    chmod 777 /home/immobot/status

RUN mkdir /home/logs/ && \
    touch /home/logs/cron-check-ip.log && \
    chmod 777 /home/logs/cron-check-ip.log && \
    touch /home/logs/cron-scrap.log && \
    chmod 777 /home/logs/cron-scrap.log

RUN crontab /home/immobot/cron/crontab
RUN echo 'Europe/Paris' > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

EXPOSE 6800
CMD service tor restart && \
	/etc/init.d/privoxy restart && \
	/home/immobot/cron/scripts/check-ip.sh && \
	/etc/init.d/cron start && \
    tail -f /home/logs/cron-scrap.log
