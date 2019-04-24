<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AnnonceTypeRepository")
 */
class AnnonceType
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Annonce", mappedBy="type")
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    public function __construct()
    {
        $this->name = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return String|Annonce
     */
    public function getName(): ?string
    {
        return $this->type;
    }

    public function addName(Annonce $name): self
    {
        if (!$this->name->contains($name)) {
            $this->name[] = $name;
            $name->setType($this);
        }

        return $this;
    }

    public function removeName(Annonce $name): self
    {
        if ($this->name->contains($name)) {
            $this->name->removeElement($name);
            // set the owning side to null (unless already changed)
            if ($name->getType() === $this) {
                $name->setType(null);
            }
        }

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
