import {v2 as cloudinary} from "cloudinary"
import fs from "fs";

cloudinary.config({
    cloud_name: "dv98v8ht5",
    api_key: "163546591275539",
    api_secret: "cfNwqE5UwzuUirvIR8iLOg5t1HY"
});

const uploadOnCloudinary = async (localFilePath : string) =>{
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_file: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null;

    }
}

export{uploadOnCloudinary}