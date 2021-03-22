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

const User = mongoose.model("User",{
    email: String,
    username: String,
    passwordHash: String,
    accessTokens: [String],
    grants: {
        upload: Boolean,
        admin: Boolean
    }
});

Utils.findOrCreateTags = (tags) =>
    Promise.all(tags.map(async tag=>{
        let t = await Tag.findOne({name:tag});
        if (t) return t._id;
        t = new Tag({name:tag});
        await t.save();
        return t._id;
    }));

Utils.findOrCreateCategory = async (category) => {
    let c = await Category.findOne({name: category});
    if (c) return c._id;
    c = new Category({name: category});
    await c.save();
    return c._id;
}

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

//Gets a user object by ID or Access Token
Utils.getUser = async (id) => {
    let user = await User.findOne({$or: [{_id: id},{accessTokens:id}]});

    return {
        username: user.username,
        email: user.email,
        grants: user.grants
    };
}

export default {Category,Tag,Object, User, Utils};