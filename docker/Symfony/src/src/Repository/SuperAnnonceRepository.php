<?php

namespace App\Repository;

use App\Entity\Annonce;
use App\Entity\SuperAnnonce;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SuperAnnonce|null find($id, $lockMode = null, $lockVersion = null)
 * @method SuperAnnonce|null findOneBy(array $criteria, array $orderBy = null)
 * @method SuperAnnonce[]    findAll()
 * @method SuperAnnonce[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SuperAnnonceRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SuperAnnonce::class);
    }

//    /**
//     * @return Rease[] Returns an array of Rease objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Rease
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function findDoublonFromAnnonce(Annonce $annonce)
    {
        $priceDif = 0;

        if ($annonce->getPrice() <= 100000) {
            $priceDif=1000;
        } elseif ($annonce->getPrice() > 100000 && $annonce->getPrice() <= 250000) {
            $priceDif=3000;
        } elseif ($annonce->getPrice() > 250000 && $annonce->getPrice() <= 500000) {
            $priceDif=6000;
        } elseif ($annonce->getPrice() > 500000 && $annonce->getPrice() <= 1000000) {
            $priceDif=10000;
        } elseif ($annonce->getPrice() > 1000000) {
            $priceDif=20000;
        }

        $price = $annonce->getPrice();
        $priceLow = $price-$priceDif;
        $priceHigh = $price+$priceDif;

        $surface = $annonce->getSurface();
        $surfaceLow = $surface*0.97;
        $surfaceHigh = $surface*1.03;

        return $this->createQueryBuilder('sad')
            ->andWhere('sad.nbRoom = :nbRoom')
            ->setParameter('nbRoom', $annonce->getNbRoom())

            ->andWhere('sad.postalCode = :postalCode')
            ->setParameter('postalCode', $annonce->getPostalCode())

            ->andWhere('sad.price >= :priceLow')
            ->setParameter('priceLow', $priceLow)

            ->andWhere('sad.price <= :priceHigh')
            ->setParameter('priceHigh', $priceHigh)

            ->andWhere('sad.surface >= :surfaceLow')
            ->setParameter('surfaceLow', $surfaceLow)

            ->andWhere('sad.surface <= :surfaceHigh')
            ->setParameter('surfaceHigh', $surfaceHigh)

            ->setMaxResults(1)

            ->getQuery()
            ->getOneOrNullResult()
            ;
    }
}
