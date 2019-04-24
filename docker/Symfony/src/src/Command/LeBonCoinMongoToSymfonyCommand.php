<?php
/**
 * Created by PhpStorm.
 * User: maxime
 * Date: 09/04/2018
 * Time: 14:29
 */
namespace App\Command;

use App\Entity\Annonce;
use App\Entity\AnnonceSiteOrigin;
use App\Entity\AnnonceType;
use App\Repository\AnnonceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LeBonCoinMongoToSymfonyCommand extends Command
{
    private $em;

    public function __construct(?string $name = null, EntityManagerInterface $em)
    {
        parent::__construct($name);

        $this->em = $em;
    }

    protected function configure()
    {
        $this
            // the name of the command (the part after "bin/console")
            ->setName('rease:import-leboncoin-from-mongo')

            // the short description shown while running "php bin/console list"
            ->setDescription('Import data from leboncoin mongo to symfony.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('Import data from leboncoin mongo to symfony.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        //On initialise les repository nécéssaires
        /** @var AnnonceRepository $AnnonceRepository */
        $AnnonceRepository = $this->em->getRepository(Annonce::class);
        $AnnonceSiteOriginRepository = $this->em->getRepository(AnnonceSiteOrigin::class);
        $AnnonceTypeRepository = $this->em->getRepository(AnnonceType::class);

        //On va chercherche un AnnonceSiteOrigin de type "Le Bon Coin"
        /** @var AnnonceSiteOrigin $AnnonceSiteOrigin */
        $AnnonceSiteOrigin = $AnnonceSiteOriginRepository->findOneBy(["name"=>"Le Bon Coin"]);

        //On va chercherche un AnnonceType de type "Vente"
        /** @var AnnonceType $AnnonceType */
        $AnnonceType = $AnnonceTypeRepository->findOneBy(["type"=>"Vente"]);

        //On crée notre client MongoDB
        $mongoDbClient = new \MongoDB\Client("mongodb://mongo:27017");

        //On get la collection LeBonCoin_annonces
        $collection = $mongoDbClient->bercail->LeBonCoin_annonces;

        //On initialise un iterator sur notre collection en prenant tout !
        $cursorArray = $collection->find([], [])->toArray();

        //Compteur de nouvelles annonces pour les stats
        $countNewOne = 0;
        //Compteur de d'annonces updated pour les stats
        $countUpdatedOne = 0;

        //On itère sur chaque annonce dans la collection mongo
        foreach ($cursorArray as $lbc_annonce) {
            /** @var Annonce $AnnonceAlreadyExist */
            $AnnonceAlreadyExist = $AnnonceRepository->findOneBy([
                'originId' => $lbc_annonce["id"]
            ]);

            if (!$AnnonceAlreadyExist) {

                //On incrémente le compteur de nouvelle annonces pour les stats
                $countNewOne++;

                //On crée une new entité annonce
                $newReaseAnnonce = new Annonce();

                //On cherche le titre
                if ($lbc_annonce["title"]) {
                    $newReaseAnnonce->setTitle($lbc_annonce["title"]);
                }

                //On cherche l'id LEBONCOIN
                if ($lbc_annonce["id"]) {
                    $newReaseAnnonce->setOriginId($lbc_annonce["id"]);
                }



//                dump($lbc_annonce["price"]);
//                die();

                //On cherche le code postal
                if($lbc_annonce["location"]["zipcode"])
                    $newReaseAnnonce->setPostalCode((int)$lbc_annonce["location"]["zipcode"]);

                //On cherche la ville
                if($lbc_annonce["location"]["city"])
                    $newReaseAnnonce->setCity($lbc_annonce["location"]["city"]);

//                //On cherche le prix
//                if($lbc_annonce["price"])
////                    if($lbc_annonce["price"] ==  null){
////                        dump($lbc_annonce["price"]);
////                        die();
////                    }
                $newReaseAnnonce->setPrice((float)$lbc_annonce["price"]);

                //On cherche l'url lbc de l'annonce
                if($lbc_annonce["link"])
                    $newReaseAnnonce->setUrl($lbc_annonce["link"]);

                //On cherche la decription
                if ($lbc_annonce["description"]) {
                    $newReaseAnnonce->setDescription($lbc_annonce["description"]);
                }

                //On chercher les photos
                if ($lbc_annonce["images"]) {
                    $newReaseAnnonce->setImage((array)$lbc_annonce["images"]);
                }

                //On cherche les critères spécifiques "immobilier" à lbc
                if(array_key_exists('attributes', $lbc_annonce)){
                    $specAttrs = $lbc_annonce["attributes"];
                    foreach ($specAttrs as $key => $specAttr){
                        //On cherche le nombre de pièce
                        if($key == "rooms")
                            $newReaseAnnonce->setNbRoom((int)$specAttrs["rooms"]);
                        //On cherche la surface
                        if($key == "square")
                            $newReaseAnnonce->setSurface((int)$specAttrs["square"]);
                    }
                }

                //On précise que notre annonce provient de lbc
                $newReaseAnnonce->setSite($AnnonceSiteOrigin);

                //On précise que notre annonce est à la vente
                $newReaseAnnonce->setType($AnnonceType);

                //On précisé date de création et update
                $newReaseAnnonce->setCreatedAt(new \DateTime());
                $newReaseAnnonce->setUpdatedAt(new \DateTime());

                //Persist
                $this->em->persist($newReaseAnnonce);
            } else {
                $countUpdatedOne++;

                // At least we save updated_at for clean
                $AnnonceAlreadyExist->setUpdatedAt(new \DateTime());

                // TODO make a diff beetwyn existing annonce and same one to see if there is some updates to save.

//                // We check if one of main criterias which are used to determine doublon has changed.
//
//
//                // First we need to sanitize main criterias fields data from specific siteOrigin to ad dataModel
//                $getSanitizeMainCriteriasFields = $this->getSpecificSanitizedMainCriteriasFieldsForAd($AnnonceAlreadyExist, $lbc_annonce)
//
//                // We check if one of main criterias has changed.
//                $checkIfOneOfAdMainCriteriasHasChanged = $AnnonceRepository->checkIfOneOfAdMainCriteriasHasChanged($AnnonceAlreadyExist, $getSanitizeMainCriteriasFields);
//
//                // If yes :
//                if($checkIfOneOfAdMainCriteriasHasChanged){
//                    // We update Annonce fields
//                    $AnnonceRepository->updateMainCriteriaAd($AnnonceAlreadyExist,$getSanitizeMainCriteriasFields);
//                    // If ad is the first one of a SuperAnnonce we unlink each ad inside and we archive the sad
//                    // If the ad is just a child of a sad we unlink the ad from it
//                }
            }
        }

        // Flush
        $this->em->flush();

        $now = new \DateTime();

//        $collection->drop();
//        $deletedResult = $collection->deleteMany([]);

        $output->writeln([
            "###############################################",
            "Récapitulatif LeBonCoinMongoToSymfonyCommand du ".$now->format("d-m-Y")." à ".$now->format("H:i:s"),
            "============",
            "Nombre d'annonce trouvé dans mongo : ".count($cursorArray),
            "Nombre d'annonce ajoutées dans SF : ".$countNewOne,
            "Nombre d'annonce déja présente et mise à jour dans SF : ".$countUpdatedOne,
            "Nombre d'annonce supprimées dans mongo : TODO",//.$deletedResult->getDeletedCount(),
            "###############################################",
        ]);
    }

    private function getSpecificSanitizedMainCriteriasFieldsForAd(Annonce $AnnonceAlreadyExist, $lbc_annonce)
    {
        $cleanCriterias= [];

        //On cherche le code postal
        if($lbc_annonce["location"]["zipcode"])
            $cleanCriterias["postalCode"] = (int)$lbc_annonce["location"]["zipcode"];

        //On cherche le prix
        if ($lbc_annonce["price"]) {
            $cleanCriterias["price"] = (float)$lbc_annonce["price"];
        }

        //On cherche les critères spécifiques "immobilier" à lbc
        if(array_key_exists('attributes', $lbc_annonce)){
            $specAttrs = $lbc_annonce["attributes"];
            foreach ($specAttrs as $specAttr){
                //On cherche le nombre de pièce
                if ($specAttr["key"] == "rooms") {
                    $cleanCriterias["nbRoom"] = (int)$specAttr["value"];
                }
                //On cherche la surface
                if ($specAttr["key"] == "square") {
                    $cleanCriterias["surface"] = (int)$specAttr["value"];
                }
            }
        }

        return $cleanCriterias;
    }
}
