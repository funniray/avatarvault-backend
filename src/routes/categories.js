import Express from 'express'

const router = new Express.Router();

router.get("",async (req,res)=>{
    let results = await req.app.models.Category.find({name:/.*/});

    res.send(results);
})

export default router;