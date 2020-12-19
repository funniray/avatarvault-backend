import Express from 'express'

const router = new Express.Router();

router.get("",async (req,res)=>{
    const models = req.app.models;
    const page = (req.query.page || 1)-1;
    let limit = Number(req.query.limit || 100);
    let tags = (await models.Utils.findTagsById(JSON.parse(req.query.tags || "[]")));
    const category = (await models.Utils.findCategory(req.query.category) || {})._id || /.*/;

    tags = tags.length>0 ? tags.filter(a=>a!==undefined).map(o=>o._id) : /.*/;
    limit = limit>500?500:limit;
    let results = await models.Object.find({category: category, tags: {$all: tags}}).skip(page*limit).limit(limit);

    for (let result of results) {
        result = result._doc;
        result.tags = await models.Utils.findTagsById(result.tags);
        result.category = await models.Category.findById(result.category);
    }

    res.send(results)
})

export default router;