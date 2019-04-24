<?php

namespace App\Repository;

use App\Entity\AnnonceType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method AnnonceType|null find($id, $lockMode = null, $lockVersion = null)
 * @method AnnonceType|null findOneBy(array $criteria, array $orderBy = null)
 * @method AnnonceType[]    findAll()
 * @method AnnonceType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AnnonceTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, AnnonceType::class);
    }

//    /**
//     * @return Type[] Returns an array of Type objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Type
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
