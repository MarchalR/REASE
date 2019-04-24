/**
 * SeLogerController
 *
 * @description :: Server-side logic for managing selogers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        SeLoger.find({}).exec(function (err, seloger){
          if (err) {
            return res.serverError(err);
          }
          var promises = [];
          var annonce = [];
          var i = 0;
        seloger.forEach(function(f) {
            annonce[i] = {
                "titre": f.titre,
                "descriptif":f.descriptif,
                "cp":f.cp,
                "ville":f.ville,
                "surface":f.surface,
                "nbPieces":f.nbPieces,
                "permaLien":f.permaLien,
                "photos":f.photos,
                "price":f.prix,
                "site":"SeLoger",
            };
            i++;
        });
        annonce.forEach(function(a) {
            Bercail.create(a).exec(function(err, newBercail){
                if (err) {
                    return res.serverError(err);
                }
            });
        });

          return res.ok("create");
        });
    },
    test: function (req, res) {
        let id_annonce = req.param("id");
        console.log(id_annonce);
        SeLoger.find({
            idAnnonce : id_annonce
        }).exec(function (err, seloger){
          if (err) {
            return res.serverError(err);
          }
          console.log(seloger);
          return res.ok(seloger);
        });
    },
};
