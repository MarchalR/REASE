<?php

namespace App\Controller;

use App\Entity\Annonce;
use App\Form\AnnonceFormType;
use App\Repository\AnnonceSiteOriginRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\FormTypeInterface;

/**
 * @Route("/annonce")
 */
class AnnonceController extends Controller
{
    /**
     * @Route("/", name="annonce_index", methods="GET")
     */
    public function index(AnnonceSiteOriginRepository $annonceRepository): Response
    {
        return $this->render('annonce/index.html.twig', ['annonces' => $annonceRepository->findAll()]);
    }

    /**
     * @Route("/new", name="annonce_new", methods="GET|POST")
     */
    public function new(Request $request): Response
    {
        $annonce = new Annonce();
        $form = $this->createForm(AnnonceFormType::class, $annonce);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($annonce);
            $em->flush();

            return $this->redirectToRoute('annonce_index');
        }

        return $this->render('annonce/new.html.twig', [
            'annonce' => $annonce,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="annonce_show", methods="GET")
     */
    public function show(Annonce $annonce): Response
    {
        return $this->render('annonce/show.html.twig', ['annonce' => $annonce]);
    }

    /**
     * @Route("/{id}/edit", name="annonce_edit", methods="GET|POST")
     */
    public function edit(Request $request, Annonce $annonce): Response
    {
        $form = $this->createForm(AnnonceFormType::class, $annonce);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('annonce_edit', ['id' => $annonce->getId()]);
        }

        return $this->render('annonce/edit.html.twig', [
            'annonce' => $annonce,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="annonce_delete", methods="DELETE")
     */
    public function delete(Request $request, Annonce $annonce): Response
    {
        if ($this->isCsrfTokenValid('delete'.$annonce->getId(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($annonce);
            $em->flush();
        }

        return $this->redirectToRoute('annonce_index');
    }
}
