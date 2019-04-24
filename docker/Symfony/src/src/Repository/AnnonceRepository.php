<?php

namespace App\Repository;

use App\Entity\Annonce;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Annonce|null find($id, $lockMode = null, $lockVersion = null)
 * @method Annonce|null findOneBy(array $criteria, array $orderBy = null)
 * @method Annonce[]    findAll()
 * @method Annonce[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AnnonceRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Annonce::class);
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

    public function checkIfOneOfAdMainCriteriasHasChanged(Annonce $AnnonceAlreadyExist, $getSanitizeMainCriteriasFields)
    {
        foreach ($getSanitizeMainCriteriasFields as $key => $value) {
            if ($key === "surface") {
                if ($value != $AnnonceAlreadyExist->getSurface()) {
                    return true;
                }
            }
            if ($key === "nbRoom") {
                if ($value != $AnnonceAlreadyExist->getNbRoom()) {
                    return true;
                }
            }
            if ($key === "postalCode") {
                if ($value != $AnnonceAlreadyExist->getPostalCode()) {
                    return true;
                }
            }
            if ($key === "price") {
                if ($value != $AnnonceAlreadyExist->getPrice()) {
                    return true;
                }
            }
        }
        return false;
    }
}
