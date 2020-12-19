import models from '../src/models.js';

let data = {
    categories:["avatars","props","clothing"],
    tags:["eboy","egirl","female","male","kon","animal_ears"],
    objects:[{
        category:"avatars",
        tags:["female","kon","animal_ears"],
        name:"idek at this point"
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
        let cat = categories[obj.category]._id;
        let t = obj.tags.map(str=>tags[str]._id);
        console.log(t);

        new models.Object({name: obj.name, category: cat, tags: t}).save();
    });
}

run().then(()=>console.log('done'));