import Express from 'express'

const router = new Express.Router();

router.get("",async (req,res)=>{
    const models = req.app.models;
    const page = (req.query.page || 1)-1;
    let limit = Number(req.query.limit || 20);
    let query = req.query.query;

    limit = limit>500?500:limit;
    let results = await models.Tag.find({name:new RegExp(`^${query}`)}).skip(page*limit).limit(limit);

    res.send(results)
})

export default router;