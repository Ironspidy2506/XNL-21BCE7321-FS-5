// import { NextResponse } from "next/server";
// import axios from "axios";

// const CLOUDINARY_CLOUD_NAME = "dcx2lz5wh";
// const CLOUDINARY_API_KEY = "459167398322289";
// const CLOUDINARY_API_SECRET = "t65EHnohjCAmWvjDgpjTvAvJ3IM";
// const FOLDER_NAME = "nextgenvideos";

// export async function GET() {
//   try {
//     import axios from 'axios';

// const fetchVideos = async () => {
//   try {
//     const response = await axios.get(
//       `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources/video`,
//       {
//         auth: {
//           username: 'YOUR_API_KEY',
//           password: 'YOUR_API_SECRET',
//         },
//       }
//     );

//     console.log(response.data.resources); // List of videos
//     return response.data.resources; // Array of video objects
//   } catch (error) {
//     console.error('Error fetching videos:', error);
//   }
// };

// fetchVideos();


//     return NextResponse.json(
//       { videos },
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods": "GET, OPTIONS",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Cloudinary API Error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }
