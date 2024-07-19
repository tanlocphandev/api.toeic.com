"use strict";

const cloudinaryV2 = require("cloudinary").v2;
const CLOUDINARY_CONFIG = require("../configs/cloudinary.config");

class Cloudinary {
    _cloudinary;

    constructor({ cloud_name, api_key, api_secret }) {
        this._cloudinary = cloudinaryV2;

        this._cloudinary.config({
            cloud_name,
            api_key,
            api_secret,
            secure: true,
        });
    }

    async upload({ file, folder = "audio", publicId = null, resource_type = "image" }) {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder,
            public_id: publicId,
            resource_type,
        };

        const uploadResult = await this._cloudinary.uploader.upload(file, {
            ...options,
        });

        return uploadResult;
    }

    url({ publicId, resource_type = "image", format = "png" }) {
        return this._cloudinary.url(publicId, { resource_type, format });
    }

    async getInfo({ publicId, resource_type = "image" }) {
        return await this._cloudinary.api.resource(publicId, { resource_type });
    }

    getInfoUpload(response) {
        return {
            asset_id: response.asset_id,
            public_id: response.public_id,
            format: response.format,
            resource_type: response.resource_type,
            public_id: response.public_id,
            url: response.url,
            secure_url: response.secure_url,
            duration: response.duration,
        };
    }

    get instance() {
        return this._cloudinary;
    }
}

const cloudinary = new Cloudinary(CLOUDINARY_CONFIG);

module.exports = cloudinary;
