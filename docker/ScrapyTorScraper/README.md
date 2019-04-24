ScrapyTorScraper README

Normal usage : when the container start that launch the cron service who will scrap SeLoger every 30 min and import all in Mongo Container.

Manual Scrap follow these steps :
* When the NodeTorScraper use this command to go inside : docker exec -ti ScrapyTorScraper bash
* Use this command inside the container to lunch the scrap + mongo import for all Paris : /home/immobot/cron/scripts/scrap.sh
* Same but oustide bash witheout Mongo import : torify scrapy crawl seloger -o /home/immobot/output/seloger.json -a  start_url="URL-Search-Result-SELOGER"
