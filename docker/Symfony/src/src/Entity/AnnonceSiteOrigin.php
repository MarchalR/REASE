<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AnnonceSiteOriginRepository")
 */
class AnnonceSiteOrigin
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Annonce", mappedBy="site")
     */
    private $site;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    public function __construct()
    {
        $this->type = new ArrayCollection();
        $this->site = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return String|Annonce
     */
    public function getSite(): ?string
    {
        return $this->name;
    }

    public function addSite(Annonce $site): self
    {
        if (!$this->site->contains($site)) {
            $this->site[] = $site;
            $site->setSite($this);
        }

        return $this;
    }

    public function removeSite(Annonce $site): self
    {
        if ($this->site->contains($site)) {
            $this->site->removeElement($site);
            // set the owning side to null (unless already changed)
            if ($site->getSite() === $this) {
                $site->setSite(null);
            }
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }
}
