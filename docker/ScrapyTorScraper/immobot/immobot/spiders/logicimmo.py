# -*- coding: utf-8 -*-
import scrapy
import logging
import re
from StringIO import StringIO

class LogicImmoSpider(scrapy.Spider):
    handle_httpstatus_list = [301, 302, 303, 307]
    name = "logicimmo"
    allowed_domains = ["logic-immo.com"]

    def start_requests(self):
        yield scrapy.Request(self.start_url, meta = {'dont_redirect': False, "handle_httpstatus_list" : [301, 302, 303, 307]}, callback=self.parse)

#   first parsing from start url to get link of each page
    def parse(self, response):

        self.logger.info("IS IT WORKING ???????");
        self.logger.info("IS IT WORKING ???????");
        self.logger.info("IS IT WORKING ???????");
        self.logger.info("IS IT WORKING ???????");
        self.logger.info("IS IT WORKING ???????");

        # Get total result number
        resultsNumberStringArray = response.css("h1::text").extract();
        resultNumberString = resultsNumberStringArray[0].strip();
        resultsNumberStringArray = re.findall('(\d*)', resultNumberString);
        resultNumberString = resultsNumberStringArray[0].strip();
        resultsNumber = int(resultNumberString);
        self.logger.info(resultsNumber);

        i = 1
        while i <= (resultsNumber/13) + 1:
            yield scrapy.Request(self.start_url+"/page="+str(i),meta = {'dont_redirect': True, "handle_httpstatus_list" : [301, 302, 303, 307]}, callback=self.parse_page)
            i += 1


    def parse_page(self, response):

        self.logger.info("PARSE_PAGE Method : "+response.url);
        adOnActualPage = response.css("div[data-position]").xpath('@id').extract();

        while len(adOnActualPage) > 13:
            adOnActualPage.pop(0)

        i = 0;
        while i < len(adOnActualPage):
            adDetailUrl = "https://www.logic-immo.com/detail-vente-"+adOnActualPage[i][13:]+".htm";
            yield scrapy.Request(adDetailUrl,meta = {'dont_redirect': True, "handle_httpstatus_list" : [301, 302, 303, 307]}, callback=self.parse_page_detail)
            i += 1;

    def parse_page_detail(self, response):
        self.logger.info("PARSE_PAGE_DETAIL Method : "+response.url);
        self.logger.info(response.css("h1::text").extract()[0]);

        fullAd = {};

        #iDLogicImmo
        fullAd["idLogicImmo"] = re.findall('detail-vente-(.*)\.htm', response.url)[0];

        #urlLogicImmo
        fullAd["url"] = response.url;

        #Titre
        fullAd["titre"] = response.css("h1::text").extract()[0].strip();

        #Type
        fullAd["type"] = response.css(".offer-type>p::text").extract()[0].strip();

        #Surface
        fullAd["surface"] = int(response.css(".offer-area-number::text").extract()[0].strip());

        #Nombre de pièces
        nbPieces = response.css(".offer-rooms-number::text").extract();
        if (len(nbPieces) > 0):
            fullAd["pieces"] = int(nbPieces[0].strip());
        else:
            fullAd["pieces"] = "N/C";

        #Prix FAI
        fullAd["prix-fai"] = int(response.css(".main-price::text").extract()[0].strip().encode('ascii', 'ignore').replace(" ", ""));

        #Prix net vendeur
        prixnet = response.css("#valuePriceFeesFree::text").extract();
        if (len(prixnet) > 0):
            if(prixnet[0].strip().encode('ascii', 'ignore')[:-1].replace(" ", "") != "Nousconsulte"):
                fullAd["prix-net"] = int(prixnet[0].strip().encode('ascii', 'ignore')[:-1].replace(" ", ""));
        else:
            fullAd["prix-net"] = "N/C";

        #Commission agence
        commission = response.css("#valuePriceFeesNetSeller::text").extract();
        if (len(commission) > 0):
            if(commission[0].strip().encode('ascii', 'ignore').replace(" ", "") != "NC"):
                fullAd["commission"] = float(commission[0].strip().encode('ascii', 'ignore')[:-1].replace(" ", ""));
        else:
            fullAd["commission"] = "N/C";

        #Code postal
        zip = response.css("div[itemprop=address]>p::text").extract();
        if (len(zip) > 0):
            zipString = zip[0].strip().encode('ascii', 'ignore')[:-1].replace(" ", "");
            fullAd["zip"] = int(re.findall('(\d{5})', zipString)[0]);
        else:
            fullAd["zip"] = "N/C";

        #Description
        description = response.css(".offer-description-text>h2::text").extract()[0].strip();
        fullAd["description"] = description + response.css(".offer-description-text>p::text").extract()[0].strip();

        #Photos
        photos = [];
        imagesMini = response.css(".minThumbs>ul>li>a>img").xpath('@src').extract();
        if len(imagesMini) > 0:
            for imageMini in imagesMini:
                photo = {};
                photo["mini"] = imageMini;
                photo["big"] = imageMini.replace("photo-prop-75x75","photo-prop-800x600");
                photos.append(photo)
        fullAd["photos"] = photos;

        #Critères supplémentaires
        criteriaLabel = response.css(".criteria-label::text").extract();
        criteriaValue = response.css(".criteria-value::text").extract();
        i = 0;
        while i < len(criteriaLabel):
            #Etage
            if criteriaLabel[i] == "Etage du bien":
                fullAd["etage"] = int(re.findall('(\d{1,})', criteriaValue[i][0])[0]);
            #Cave
            if criteriaLabel[i] == "Cave":
                fullAd["cave"] = criteriaValue[i];
            #Chauffage
            if criteriaLabel[i] == "Chauffage":
                fullAd["chauffage"] = criteriaValue[i];
            #Ascenseur
            if criteriaLabel[i] == "Ascenseur":
                fullAd["ascenseur"] = criteriaValue[i];
            #Terrasse/Balcon
            if criteriaLabel[i] == "Terrasse/Balcon":
                fullAd["ext"] = criteriaValue[i];
            i += 1;


        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info(criteriaLabel);
        self.logger.info(criteriaValue);
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");
        self.logger.info("DEBUG");

        yield fullAd;