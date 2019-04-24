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

class LogicimmoMongoToSymfonyCommand extends Command
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
            ->setName('rease:import-logicimmo-from-mongo')

            // the short description shown while running "php bin/console list"
            ->setDescription('Import data from logicimmo mongo to symfony.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('Import data from logicimmo mongo to symfony.')
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
        $AnnonceSiteOrigin = $AnnonceSiteOriginRepository->findOneBy(["name"=>"Logic Immo"]);

        //On va chercherche un AnnonceType de type "Vente"
        /** @var AnnonceType $AnnonceType */
        $AnnonceType = $AnnonceTypeRepository->findOneBy(["type"=>"Vente"]);

        //On crée notre client MongoDB
        $mongoDbClient = new \MongoDB\Client("mongodb://mongo:27017");

        //On get la collection logicimmo
        $collection = $mongoDbClient->bercail->logicimmo;

        //On initialise un iterator sur notre collection en prenant tout !
        $cursorArray = $collection->find([], [])->toArray();

        //Compteur de nouvelles annonces pour les stats
        $countNewOne = 0;
        //Compteur de d'annonces updated pour les stats
        $countUpdatedOne = 0;

        //On itère sur chaque annonce dans la collection mongo
        foreach ($cursorArray as $logicimmo_annonce) {
            /** @var Annonce $AnnonceAlreadyExist */
            $AnnonceAlreadyExist = $AnnonceRepository->findOneBy([
                'originId' => $logicimmo_annonce["idLogicImmo"]
            ]);

            if (!$AnnonceAlreadyExist) {

                //On incrémente le compteur de nouvelle annonces pour les stats
                $countNewOne++;

                //On crée une new entité annonce
                $newReaseAnnonce = new Annonce();

                //On cherche le titre
                if ($logicimmo_annonce["titre"]) {
                    $newReaseAnnonce->setTitle($logicimmo_annonce["titre"]);
                }

                //On cherche l'id Logic Immo
                if ($logicimmo_annonce["idLogicImmo"]) {
                    $newReaseAnnonce->setOriginId($logicimmo_annonce["idLogicImmo"]);
                }

                //On cherche le code postal
                if ($logicimmo_annonce["zip"]) {
                    $newReaseAnnonce->setPostalCode((int)$logicimmo_annonce["zip"]);
                }

                //On cherche la ville
//                if($logicimmo_annonce["details"]["location"]["city"])
                $newReaseAnnonce->setCity("Paris");

                //On cherche le prix
                if ($logicimmo_annonce["prix-fai"]) {
                    $newReaseAnnonce->setPrice((float)$logicimmo_annonce["prix-fai"]);
                }

                //On cherche l'url Logic Immo de l'annonce
                if ($logicimmo_annonce["url"]) {
                    $newReaseAnnonce->setUrl($logicimmo_annonce["url"]);
                }

                //On cherche la decription
                if ($logicimmo_annonce["description"]) {
                    $newReaseAnnonce->setDescription($logicimmo_annonce["description"]);
                }

                //On chercher les photos
                if ($logicimmo_annonce["photos"]) {
                    $photos = [];
                    foreach ($logicimmo_annonce["photos"] as $photo) {
                        $photos[] = $photo["big"];
                    }
                    $newReaseAnnonce->setImage((array)$photos);
                }

                //On cherche le nombre de pièce
                if ($logicimmo_annonce["pieces"]) {
                    $newReaseAnnonce->setNbRoom((int)$logicimmo_annonce["pieces"]);
                }

                //On cherche la surface
                if ($logicimmo_annonce["surface"]) {
                    $newReaseAnnonce->setSurface((int)$logicimmo_annonce["surface"]);
                }

                //On précise que notre annonce provient de lbc
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
        };

        // Flush
        $this->em->flush();

        $now = new \DateTime();

        $collection->drop();
        $deletedResult = $collection->deleteMany([]);

        $output->writeln([
            "###############################################",
            "Récapitulatif LogicimmoMongoToSymfonyCommand du ".$now->format("d-m-Y")." à ".$now->format("H:i:s"),
            "============",
            "Nombre d'annonce trouvé dans mongo : ".count($cursorArray),
            "Nombre d'annonce ajoutées dans SF : ".$countNewOne,
            "Nombre d'annonce déja présente et mise à jour dans SF : ".$countUpdatedOne,
            "Nombre d'annonce supprimées dans mongo : ".$deletedResult->getDeletedCount(),
            "###############################################",
        ]);
    }
}
