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
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SeLogerMongoToSymfonyCommand extends Command
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
            ->setName('rease:import-seloger-from-mongo')

            // the short description shown while running "php bin/console list"
            ->setDescription('Import data from seloger mongo to symfony.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('Import data from seloger mongo to symfony.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        //On initialise les repository nécéssaires
        $AnnonceRepository = $this->em->getRepository(Annonce::class);
        $AnnonceSiteOriginRepository = $this->em->getRepository(AnnonceSiteOrigin::class);
        $AnnonceTypeRepository = $this->em->getRepository(AnnonceType::class);

        //On va chercherche un AnnonceSiteOrigin de type "Logic Immo"
        /** @var AnnonceSiteOrigin $AnnonceSiteOrigin */
        $AnnonceSiteOrigin = $AnnonceSiteOriginRepository->findOneBy(["name"=>"Se Loger"]);

        //On va chercherche un AnnonceType de type "Vente"
        /** @var AnnonceType $AnnonceType */
        $AnnonceType = $AnnonceTypeRepository->findOneBy(["type"=>"Vente"]);

        //On crée notre client MongoDB
        $mongoDbClient = new \MongoDB\Client("mongodb://mongo:27017");

        //On get la collection logicimmo
        $collection = $mongoDbClient->bercail->seloger;

        //On initialise un iterator sur notre collection en prenant tout !
        $cursorArray = $collection->find([], [])->toArray();

        //Compteur de nouvelles annonces pour les stats
        $countNewOne = 0;
        //Compteur de d'annonces updated pour les stats
        $countUpdatedOne = 0;

        //On itère sur chaque annonce dans la collection mongo
        foreach ($cursorArray as $seloger_annonce) {
            if (array_key_exists("idAnnonce", $seloger_annonce)
                && array_key_exists('prix', $seloger_annonce)) {

                /** @var Annonce $AnnonceAlreadyExist */
                $AnnonceAlreadyExist = $AnnonceRepository->findOneBy([
                    'originId' => $seloger_annonce["idAnnonce"]
                ]);

                if (!$AnnonceAlreadyExist) {

                    //On incrémente le compteur de nouvelle annonces pour les stats
                    $countNewOne++;

                    //On crée une new entité annonce
                    $newReaseAnnonce = new Annonce();

                    //On cherche le titre
                    if (array_key_exists('titre', $seloger_annonce) && $seloger_annonce["titre"]) {
                        $newReaseAnnonce->setTitle($seloger_annonce["titre"]);
                    } else {
                        $newReaseAnnonce->setTitle($seloger_annonce["cp"]." - ".$seloger_annonce["surface"]." m2 à ".$seloger_annonce["prix"]." Euros");
                    }

                    //On cherche l'id Logic Immo
                    if ($seloger_annonce["idAnnonce"]) {
                        $newReaseAnnonce->setOriginId($seloger_annonce["idAnnonce"]);
                    }

                    //On cherche le code postal
                    if ($seloger_annonce["cp"]) {
                        $newReaseAnnonce->setPostalCode((int)$seloger_annonce["cp"]);
                    }

                    //On cherche la ville
                    if ($seloger_annonce["ville"]) {
                        $newReaseAnnonce->setCity($seloger_annonce["ville"]);
                    }

                    //On cherche le prix
                    if (array_key_exists('prix', $seloger_annonce) && $seloger_annonce["prix"]) {
                        $newReaseAnnonce->setPrice((float)$seloger_annonce["prix"]);
                    }

                    //On cherche l'url SeLoger de l'annonce
                    if ($seloger_annonce["permaLien"]) {
                        $newReaseAnnonce->setUrl($seloger_annonce["permaLien"]);
                    }

                    //On cherche la decription
                    if ($seloger_annonce["descriptif"]) {
                        $newReaseAnnonce->setDescription($seloger_annonce["descriptif"]);
                    }

                    //On chercher les photos
                    if ($seloger_annonce["photos"]) {
                        $photos = [];
                        foreach ($seloger_annonce["photos"] as $photo) {
                            $photos[] = $photo["bigUrl"];
                        }
                        $newReaseAnnonce->setImage((array)$photos);
                    }

                    //On cherche le nombre de pièce
                    if (array_key_exists('nbPieces', $seloger_annonce)) {
                        $newReaseAnnonce->setNbRoom((int)$seloger_annonce["nbPieces"]);
                    }

                    //On cherche la surface
                    if (array_key_exists('surface', $seloger_annonce)) {
                        $newReaseAnnonce->setSurface((int)$seloger_annonce["surface"]);
                    }

                    //On précise que notre annonce provient de SeLoger
                    $newReaseAnnonce->setSite($AnnonceSiteOrigin);

                    //On précise que notre annonce est à la vente
                    $newReaseAnnonce->setType($AnnonceType);

                    //On précise date de création et update
                    $newReaseAnnonce->setCreatedAt(new \DateTime());
                    $newReaseAnnonce->setUpdatedAt(new \DateTime());

                    //Persist
                    $this->em->persist($newReaseAnnonce);
                } else {
                    // TODO make a diff beetwyn existing annonce and same one to see if there is some updates to save.
                    // At least we save updated_at for clean
                    $AnnonceAlreadyExist->setUpdatedAt(new \DateTime());
                    $countUpdatedOne++;
                }
            }
        };

        // Flush
        $this->em->flush();

        $now = new \DateTime();

//        $collection->drop();
//        $deletedResult = $collection->deleteMany([]);

        $output->writeln([
            "###############################################",
            "Récapitulatif SeLogerMongoToSymfonyCommand du ".$now->format("d-m-Y")." à ".$now->format("H:i:s"),
            "============",
            "Nombre d'annonce trouvé dans mongo : ".count($cursorArray),
            "Nombre d'annonce ajoutées dans SF : ".$countNewOne,
            "Nombre d'annonce déja présente et mise à jour dans SF : ".$countUpdatedOne,
            "Nombre d'annonce supprimées dans mongo : TODO",//.$deletedResult->getDeletedCount(),
            "###############################################",
        ]);
    }
}
