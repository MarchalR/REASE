<?php
/**
 * Created by PhpStorm.
 * User: theo
 * Date: 21/05/2018
 * Time: 11:40
 */

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class registerControlleur extends Controller
{

    /**
     * @Route("/api/register", name="api_register" , methods="POST")
     */
    public function register_api(Request $request)
    {
        $email = $request->request->get('email');
        if (!$email) {
            return $this->json(array('message' => 'undefined email', "status"=>'400'), 400);
        }
        $username = $request->request->get('username');
        if (!$username) {
            return $this->json(array('message' => 'undefined username', "status"=>'400'), 400);
        }
        $password = $request->request->get('password');
        if (!$password) {
            return $this->json(array('message' => 'undefined password', "status"=>'400'), 400);
        }
        $userManager = $this->container->get('fos_user.user_manager');

        $user = $userManager->createUser();
        if ($userManager->findUserByUsernameOrEmail($email) && $userManager->findUserByUsernameOrEmail($username)) {
            return $this->json(array('message' => 'user exist', "status"=>'404'), 404);
        }

        $user->setUsername($username);
        $user->setEmail($email);
        $user->setEmailCanonical($email);
        $user->setRoles(array('ROLE_REASE'));
        $user->setEnabled(1); // enable the user or enable it later with a confirmation token in the email
        // this method will encrypt the password with the default settings :)
        $user->setPlainPassword($password);
        $userManager->updateUser($user);
        if (!$userManager->findUserByUsernameOrEmail($email) && !$userManager->findUserByUsernameOrEmail($username)) {
            return $this->json(array('message' => "user not create", "status"=>'400'), 400);
        }

        return $this->json(array('message' => 'user created', "status"=>'200'), 200);
    }
}
