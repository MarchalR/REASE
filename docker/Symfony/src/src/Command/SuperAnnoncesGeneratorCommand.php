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
use App\Entity\SuperAnnonce;
use App\Repository\AnnonceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SuperAnnoncesGeneratorCommand extends Command
{
    private $em;
    private $SuperAnnonceRepository;

    public function __construct(?string $name = null, EntityManagerInterface $em)
    {
        parent::__construct($name);

        $this->em = $em;
        $this->SuperAnnonceRepository = $this->em->getRepository(SuperAnnonce::class);
    }

    protected function configure()
    {
        $this
            // the name of the command (the part after "bin/console")
            ->setName('rease:sad-generator')

            // the short description shown while running "php bin/console list"
            ->setDescription('Generate SADs from ADs.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('Generate SADs from ADs.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {


        //On initialise les repository nécéssaires
        $AnnonceRepository = $this->em->getRepository(Annonce::class);

        //Get all annonces
        $allAnnonces = $AnnonceRepository->findAll();

//        dump(count($allAnnonces));
//        die();

        /** @var Annonce $annonce */
        foreach ($allAnnonces as $annonce){

            if($annonce->getSuperannonce() == null){

                $CheckIfAnnonceHasSuperAnnonceDoublon = $this->checkIfAnnonceHasSuperAnnonceDoublon($annonce);

                if (!$CheckIfAnnonceHasSuperAnnonceDoublon) {
                    $newSuperAnnonce = new SuperAnnonce();
                    $this->copyAnnonceInsideNewSuperAnnonce($newSuperAnnonce, $annonce);
                    $annonce->setSuperannonce($newSuperAnnonce);
                    $this->em->persist($newSuperAnnonce);
                    $this->em->flush();
                } else {
//                    $doublonsArray = $CheckIfAnnonceHasSuperAnnonceDoublon->getAnnonce();
//                    $doublonsArray[] = $annonce;

                    $doublonUrlArray = $CheckIfAnnonceHasSuperAnnonceDoublon->getUrl();
                    $doublonUrlArray[] = $annonce->getUrl();

                    $CheckIfAnnonceHasSuperAnnonceDoublon->addAnnonce($annonce);
                    $CheckIfAnnonceHasSuperAnnonceDoublon->setUrl($doublonUrlArray);

                    $annonce->setSuperannonce($CheckIfAnnonceHasSuperAnnonceDoublon);

                    $this->em->persist($CheckIfAnnonceHasSuperAnnonceDoublon, $annonce);
                    $this->em->flush();
                }

            }
        }
        $this->em->flush();
    }

    private function copyAnnonceInsideNewSuperAnnonce(SuperAnnonce $newSuperAnnonce, Annonce $annonce)
    {
        $newSuperAnnonce->setTitle($annonce->getTitle());
        $newSuperAnnonce->setImage($annonce->getImage());
        $newSuperAnnonce->setSurface($annonce->getSurface());
        $newSuperAnnonce->setNbRoom($annonce->getNbRoom());
        $newSuperAnnonce->setDescription($annonce->getDescription());
        $newSuperAnnonce->setType($annonce->getType());
        $newSuperAnnonce->setPostalCode($annonce->getPostalCode());
        $newSuperAnnonce->setCity($annonce->getCity());
        $newSuperAnnonce->setPrice($annonce->getPrice());
        $newSuperAnnonce->setUrl([$annonce->getUrl()]);
        $newSuperAnnonce->setAnnonce([$annonce]);
    }

    private function checkIfAnnonceHasSuperAnnonceDoublon(Annonce $annonce)
    {
        /** @var SuperAnnonce $doublon */
        $doublon = $this->SuperAnnonceRepository->findDoublonFromAnnonce($annonce);
        if ($doublon !== null) {
            dump("@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            dump("Comparatif du doublon(SuperAnnonce) vs Annonce");
            dump("Ids");
            dump($doublon->getId());
            dump($annonce->getId());
            dump("Surface");
            dump($doublon->getSurface());
            dump($annonce->getSurface());
            dump("Price");
            dump($doublon->getPrice());
            dump($annonce->getPrice());
            dump("NbRoom");
            dump($doublon->getNbRoom());
            dump($annonce->getNbRoom());
            dump("PostalCode");
            dump($doublon->getPostalCode());
            dump($annonce->getPostalCode());
            dump("URLs");
            dump($doublon->getUrl());
            dump($annonce->getUrl());
            return $doublon;
        }
        return false;
    }
}
