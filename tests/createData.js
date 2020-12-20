import models from '../src/models.js';

let data = {
    categories:["avatars","props","clothing"],
    tags:["eboy","egirl","female","male","kon","animal_ears"],
    objects:[{
        category:"avatars",
        tags:["female","kon","animal_ears"],
        name:"idek at this point",
        previewImage:"https://i.imgur.com/39GZGzZ.png",
        fileSize:3670016,
        file:"https://i.imgur.com/39GZGzZ.png"
    },{
        category:"avatars",
        tags:["egirl","female","animal_ears"],
        name:"Another One",
        previewImage:"https://i.imgur.com/EHkbIzC.png",
        fileSize:6770016,
        file:"https://i.imgur.com/EHkbIzC.png"
    },{
        category:"avatars",
        tags:["egirl","female","animal_ears"],
        name:"third",
        previewImage:"https://i.imgur.com/KKujmAv.png",
        fileSize:7670016,
        file:"https://i.imgur.com/c9DcW6C.png"
    }]
}

const run = async()=>{
    let categories = {};
    let tags = {};
    data.categories.forEach(str=>categories[str] = new models.Category({name:str}));
    data.tags.forEach(str=>tags[str] = new models.Tag({name:str}));

    console.log(categories);
    for(let category in categories) {await categories[category].save()}
    for(let tag in tags) {await tags[tag].save()}

    data.objects.forEach(obj=>{
        obj.category = categories[obj.category]._id;
        obj.tags = obj.tags.map(str=>tags[str]._id);

        new models.Object(obj).save();
    });
}

run().then(()=>console.log('done'));