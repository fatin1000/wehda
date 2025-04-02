import express from "express"
import { adminProtectRoute } from "../middleware/admin.middleware.js"
import {getAllUsers,getUserScraps,deleteUser,desActiveUser,activeUser,userScraps, deleteScrap, adminDeleteScrap, activeScrap,getAllScraps, messageSend,getAllMails, mailRead, getMail,deleteMail, singup, login, logout, getCurrentUser} from '../controllers/admin.controller.js'

const router = express.Router()

router.post("/signup",singup)
router.post("/login",login)
router.post("/logout",adminProtectRoute,logout)
router.get('/adminAuth',adminProtectRoute,getCurrentUser)

router.get('/allUsers',adminProtectRoute,getAllUsers)
router.get('/scraps/:id',adminProtectRoute,getUserScraps)
router.delete('/delete/:id',adminProtectRoute,deleteUser)
router.put('/desActive/:id',adminProtectRoute,desActiveUser)
router.put('/active/:id',adminProtectRoute,activeUser)

router.get('/userScraps/:id',adminProtectRoute,userScraps)
router.put('/desActiveScraps/:id',adminProtectRoute,deleteScrap)
router.put('/activeScraps/:id',adminProtectRoute,activeScrap)
router.delete('/scrapDelete/:id',adminProtectRoute,adminDeleteScrap)

router.get('/allScraps',adminProtectRoute,getAllScraps)

router.post('/mail',adminProtectRoute,messageSend)
router.get('/allMails',adminProtectRoute,getAllMails)
router.put('/mailRead/:id',adminProtectRoute,mailRead)
router.get('/mailMsg/:id',adminProtectRoute,getMail)
router.delete('/deleteMail/:id',adminProtectRoute,deleteMail)

export default router;