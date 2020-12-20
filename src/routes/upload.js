import Express from 'express'
import fs from 'fs';
import {promisify} from 'util'

const unlink = promisify(fs.unlink);

const router = new Express.Router();

router.post('/checkPass', (req,res)=>{
    if (req.body.password === process.env.PASSWORD) {
        res.send(true);
    } else {
        res.send(false);
    }
})

router.post("",async (req,res)=>{
    if (req.body.password !== process.env.PASSWORD) {
        for(let f in req.files) {
            await unlink(req.files[f].tempFilePath);
        }
        res.send(`got password ${req.body.password}`);
        return;
    }
    const file = req.files.file;
    const preview = req.files.preview;
    const tags = JSON.parse(req.body.tags);
    const category = req.body.category;

    const fileNameSplit = file.name.split('.');

    const fileExtension = fileNameSplit[fileNameSplit.length-1]
    fileNameSplit.pop();
    const fileName = fileNameSplit.join('.');
    let previewExtension;
    if (preview)
        previewExtension = preview.name.split('.')[preview.name.split('.').length - 1]

    const tagIds = await req.app.models.Utils.findOrCreateTags(tags);
    const categoryId = await req.app.models.Utils.findOrCreateCategory(category);

    const baseurl = process.env.CDNURL || `http://localhost:${process.env.PORT || 3010}`;
    const storageLocation = process.env.STORAGELOCATION || `./objects`;

    let obj = new req.app.models.Object({
        name: fileName,
        category: categoryId,
        tags: tagIds,
        fileSize: file.size,
    });

    obj.file = `${baseurl}/${obj._id}.${fileExtension}`;
    if (preview)
        obj.previewImage = `${baseurl}/${obj._id}.${previewExtension}`;

    await file.mv(`${storageLocation}/${obj._id}.${fileExtension}`);
    if (preview)
        await preview.mv(`${storageLocation}/${obj._id}.${previewExtension}`);

    for(let f in req.files) {
        if (f!=='preview'&&f!=='file')
        await fs.unlink(req.files[f].tempFilePath)
    }

    await obj.save();

    res.send(JSON.stringify(obj));
})

export default router;