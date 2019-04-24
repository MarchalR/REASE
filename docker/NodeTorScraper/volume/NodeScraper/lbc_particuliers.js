const leboncoin = require('leboncoin-api');
var fs = require('fs')
var MongoClient = require("mongodb").MongoClient;
var async = require("async");

var search = new leboncoin.Search()
    //.setPage(1)
    //.setQuery("renove")
    // .setFilter(leboncoin.FILTERS.PARTICULIER)
    .setCategory("ventes_immobilieres")
    .setRegion("ile_de_france")
    .setDepartment("paris");
   // .addSearchExtra("mrs", 250) // min rent
  //  .addSearchExtra("mre", 1250); // min rent

function getNbResult() {
    return search.run().then(function (data) {
        console.log(data.pages); // the number of pages
        return data.nbResult;
	}).catch(catchError);
}

function getNumberOfPage() {
    return search.run().then(function (data) {
        return data.pages;
    }).catch(catchError);
}


/**
 console.log(data.page); // the current page
 console.log(data.pages); // the number of pages
 console.log(data.nbResult); // the number of results for this search
 */

function getAdOnPage() {
    return search.run().then(function (data) {
        return data.results;
	}).catch(catchError);
}

function getAdDetails(data) {
    return data.getDetails().then(function (details) {
        return details;
	}).catch(catchError);
}

var catchError = function(e) {
    console.error("Error : ", e);
}

async function getAllAd() {
	console.log("debut");


	console.log("On récupère le nombre d'annonce totale");
	var nbResult = await getNbResult();
	console.log(nbResult);

	var nbPage =  await getNumberOfPage();

	console.log("nb page : "+nbPage);


	console.log("Pour chaque page on va rechercher les annonces.");
	var AllData = [];
    for (var i = 1; i < nbPage; i++) {
        search.setPage(i);
        var pageData = await getAdOnPage();


        // console.log(pageData[0]["title"]);

        console.log("Nb d'annonce par page : "+pageData.length);

        for (var j = 0; j < pageData.length; j++) {
			var adData = await getAdDetails(pageData[j]);
            // console.log(pageData);
			AllData.push(adData);
        }
    }

    console.log("Nombre d'annonces total récupérés :");
    console.log(AllData.length);

	MongoClient.connect("mongodb://mongo:27017/", function(err, db) {
	    if (err) throw err;

	    console.log("Connecté à la base de données 'LeBonCoin_annonces'");

	    var dbo = db.db("bercail");

	    for (var h = 0; h < AllData.length; h++) {
		    dbo.collection("LeBonCoin_annonces").insertOne(AllData[h], function(err, res) {
		        if (err) throw err;
		        console.log("Document inserted");
		    });
        }

        console.log("Fin du script close connection à mongo.")
	    db.close();

	});
}

getAllAd();
