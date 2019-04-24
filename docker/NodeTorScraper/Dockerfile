FROM node:8.4-stretch
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install tor curl wget -y
RUN apt-get install gcc -y
RUN apt-get install mongodb-clients -y
RUN apt-get install python-pip -y
RUN apt-get install python-dev python-pip libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev -y
RUN pip install pip --upgrade
RUN pip install pymongo
RUN pip freeze > requirements.txt
RUN curl https://bootstrap.pypa.io/get-pip.py | python
RUN apt-get install privoxy -y
RUN apt-get install nano -y
RUN apt-get install libcurl4-gnutls-dev librtmp-dev -y
RUN pip install pycurl
RUN apt-get install git -y

COPY volume/ /home/NodeTorScraper/
VOLUME /home/NodeTorScraper

RUN chmod 777 /home/NodeTorScraper/cron/scripts/check-ip.sh && \
    chmod +x /home/NodeTorScraper/cron/scripts/check-ip.sh && \
    chmod 777 /home/NodeTorScraper/cron/scripts/scrap.sh && \
    chmod +x /home/NodeTorScraper/cron/scripts/scrap.sh

RUN mkdir /home/logs/ && \
    touch /home/logs/cron-check-ip.log && \
    touch /home/logs/cron-scrap.log && \
    chmod 777 /home/logs/cron-check-ip.log && \
    chmod 777 /home/logs/cron-scrap.log

WORKDIR /home/NodeTorScraper/NodeScraper

RUN cd /home/NodeTorScraper/NodeScraper && npm install && npm install --no-bin-links
RUN crontab /home/NodeTorScraper/cron/crontab
RUN echo 'Europe/Paris' > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

CMD cd /home/NodeTorScraper/NodeScraper && \
    npm install && \
    npm install --no-bin-links && \
    service tor restart && \
	/etc/init.d/privoxy restart && \
	/home/NodeTorScraper/cron/scripts/check-ip.sh && \
	/etc/init.d/cron start && \
	tail -f /home/logs/cron-scrap.log
