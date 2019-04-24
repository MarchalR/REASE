#!/bin/bash
PATH=$PATH:/usr/local/bin
export PATH

cd /home/NodeTorScraper/NodeScraper

echo "Debut du scrap" >> /home/logs/cron-scrap.log

#Scrap PARIS SELOGER
npm run scrap-lbc-part


echo "Fin du scrap" >> /home/logs/cron-scrap.log
