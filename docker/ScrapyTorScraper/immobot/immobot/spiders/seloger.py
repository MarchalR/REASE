# -*- coding: utf-8 -*-
import scrapy
import logging
import re
import pycurl
from StringIO import StringIO
from lxml import etree
import xml.etree.ElementTree as ET
import sys

class SelogerSpider(scrapy.Spider):
    handle_httpstatus_list = [301, 302, 303, 307]
    name = "seloger"
    allowed_domains = ["seloger.com"]

    def start_requests(self):
        yield scrapy.Request(self.start_url, meta = {'dont_redirect': True, "handle_httpstatus_list" : [301, 302, 303, 307]}, callback=self.parse)

    # Première étape
    def parse(self, response):

        # On arrive en GET sur la page de resultat de recherche de l'api de SELOGER
        # On a besoin de connaître le nombre de page max pour aller get chacune d'elle
        buffer = StringIO()
        c = pycurl.Curl()
        c.setopt(c.URL, self.start_url)
        c.setopt(c.WRITEDATA, buffer)
        c.perform()
        c.close()
        body = buffer.getvalue()
        root = ET.fromstring(body)
        for child in root:
            if (child.tag == "pageMax"):
                pageMax = int(child.text)

        # On déclenche une requete sur chacune de ses pages du résultat
        i = 1
        while i <= pageMax:
            yield scrapy.Request(self.start_url+"&SEARCHpg="+str(i),meta = {'dont_redirect': True, "handle_httpstatus_list" : [301, 302, 303, 307]}, callback=self.parse_page)
            i += 1

    # Seconde étape
    def parse_page(self, response):
        #On récupère l'id de chaque annonce de la page

        buffer = StringIO()
        c = pycurl.Curl()
        c.setopt(c.URL, response.url)
        c.setopt(c.WRITEDATA, buffer)
        c.perform()
        c.close()
        body = buffer.getvalue()
        root = ET.fromstring(body)

        for firstLevelFields in root:
            if (firstLevelFields.tag == "annonces"):
                for annonces in firstLevelFields:

                    dico = {}

                    for annonce in annonces:
                        if (annonce.tag == "photos"):
                            dico[annonce.tag] = {}
                            j = 0
                            for photos in annonce:
                                dico[annonce.tag][j] = {}
                                for photo in photos:
                                    dico[annonce.tag][j][photo.tag] = photo.text
                                j = j + 1
                        else:
                            dico[annonce.tag] = annonce.text

                    yield dico