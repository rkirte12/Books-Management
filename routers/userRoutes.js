const router = require("express").Router();
const userOperation = require("../controller/userOperation")
const auth = require("../controller/middleWare")

router.post("/register", userOperation.userSignUp);
router.post("/login", userOperation.userLogin);

//middleware
router.get("/view-all",auth, userOperation.viewAll)
router.get("/sort-asce", auth , userOperation.sortAsce)
router.post("/search/:bookname", auth , userOperation.searchBooks)
router.put("/updatebookname/:id", auth, userOperation.updateBook)
router.delete("/deleteRecord/:id", auth, userOperation.deleteRecord)
router.post("/findpage", auth, userOperation.page)

module.exports = router;