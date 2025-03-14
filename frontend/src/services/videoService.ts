import axios from "axios";

const PEXELS_API_KEY = "u566iDApuJX0aqOJMTSJvs08XD7o0KP2h5BWsCV3g0OEokopUlh24J1e"; // Replace with your actual API key
const PEXELS_API_URL = "https://api.pexels.com/videos/search";

export const fetchVideos = async (query = "technology", page = 1) => {
  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: { Authorization: PEXELS_API_KEY },
      params: { query, per_page: 10, page }, // Ensure per_page is set to 10
    });

    const videos = response.data.videos || [];

    if (videos.length === 0) {
      return [];
    }

    return videos.map((video) => ({
      id: video.id.toString(),
      url: video.video_files.length > 0 ? video.video_files[0].link : "", // Ensure valid video file
      username: video.user?.name || "Pexels User",
      caption: video.description || "Amazing video from Pexels!",
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      isLiked: false,
    })).filter(video => video.url !== ""); // Remove videos with no valid URL

  } catch (error) {
    console.error("Error fetching videos from Pexels:", error);
    return [];
  }
};
