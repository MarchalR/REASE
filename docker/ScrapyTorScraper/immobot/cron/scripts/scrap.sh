#!/bin/bash
PATH=$PATH:/usr/local/bin
export PATH

rm /home/immobot/output/*
cd /home/immobot

#Scrap SELOGER
torify scrapy crawl seloger -o /home/immobot/output/seloger.json -a  start_url="http://ws.seloger.com/search.xml?cp=75&idtt=2,5&idtypebien=1,2&naturebien=1,2,4"

#ScrapLOGICIMMO
torify scrapy crawl logicimmo -o /home/immobot/output/logicimmo.json -a  start_url="https://www.logic-immo.com/vente-immobilier-paris-75,100_1/options/groupprptypesids=1,2,6,7,12,15"

mongoimport --jsonArray --db bercail --collection seloger --host mongo:27017 --file /home/immobot/output/seloger.json
mongoimport --jsonArray --db bercail --collection logicimmo --host mongo:27017 --file /home/immobot/output/logicimmo.json

rm /home/immobot/output/*

