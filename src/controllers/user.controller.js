import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import{User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    
    //username
    //email
    //password
    // fullname
    //avatar
    //watched history
    //coverImage


    // 1. get user details from frontend
    const{username, email, password, fullname} = req.body;
    
    // console.log(req.body);
    //way to check data is coming from frontend or not and for debug
    // console.log(email);
    // console.log(password);

    // 2. //validation - not empty
    // if (!username || !email || !password || !fullname) {
    //     throw new ApiError(400, "All fields are required");
    // }

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    // check email have @ or not
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email");
    }

    // 3. //check if user already exists
    const exitedUser = await User.findOne(
        {
            $or: [
                { email },
                { username }
            ]
        }
    );
    if (exitedUser) {
        throw new ApiError(409, "Username and email already exists");
    }
    // 4. check for images, check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //debug
    console.log("Avatar:", avatarLocalPath);
    console.log("Cover Image:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }

    // 5. upload them into cloudinary and check avatar upload or not
    const avatar =  await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar image upload failed");
    }

    // 6. create user object -> create entry in database
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // 7. Get created user without sensitive information
    // remove password and refreshToken field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(404, "User not found");
    }

    // 8. Send response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully"),
    );
});

export { registerUser };