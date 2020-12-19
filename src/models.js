import mongoose from 'mongoose';

mongoose.connect((process.env.DATABASEURL || 'mongodb://localhost:27017') +'/avatarCloud', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Utils = {}

const Category = mongoose.model("Category",{
    name: String
});

const Tag = mongoose.model("Tag",{
    name: {type: String, index: {text: true}}
});

const Object = mongoose.model("Object", {
    name: String,
    category: String, //Searching strings is easier to code than objectIds
    tags: [String],
    fileSize: Number,
    previewImage: String,
    file: String
})

Utils.findTagsById = (ids) => Promise.all(ids.map(async id=> {
    let req;
    try {
        req = await Tag.findOne({$or: [{_id: id}, {name: id}]})
    } catch(e) {
        req = await Tag.findOne({name: id})
    }
    if (req) return req;
}));

Utils.findCategory = async (category) => {
    let req;
    try {
        req = await Category.findOne({$or: [{_id: category}, {name: category}]})
    } catch(e) {
        req = await Category.findOne({name: category})
    }
    if (req) return req;
};


export default {Category,Tag,Object, Utils};