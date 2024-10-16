const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");


module.exports.index = async(req,res)=> {
    const campgrounds = await Campground.find({});
    res.send({campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    // if(!geoData){
    //     req.flash('error', 'showing default location!');
    //     campground.geometry = { type: 'Point', coordinates: [ 77.401972, 23.258372 ] }
    // }
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.send(campground._id)
    
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // console.log(campground)
    res.send( { campground });
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds');
    }
    
    res.send({campground})
}

module.exports.updateCampground = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const {id} = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        // console.log(campground);
    }
    req.flash('success','Successfully updated campground!')
    res.send(campground._id)
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted a campground!');
    res.status(200).send("ok");
}