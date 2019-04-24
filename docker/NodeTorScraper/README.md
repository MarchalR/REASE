NodeTorScraper README

Normal usage : when the container start that launch the cron service who will scrap LeBonCoin every 30 min and import all in Mongo Container.

Manual Scrap follow these steps :
* When the NodeTorScraper use this command to go inside : docker exec -ti NodeTorScraper bash
* Use this command inside the container to lunch the scrap + mongo import : /home/NodeTorScraper/cron/scripts/scrap.sh
* Same but oustide bash : cd /home/NodeTorScraper/NodeScraper && npm run scrap-lbc-part