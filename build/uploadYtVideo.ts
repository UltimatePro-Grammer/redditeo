import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import fs from "fs";
const service = google.youtube("v3");

export const uploadVideo = (
	auth: OAuth2Client,
	videoPath: string,
	title: string,
	songUrl: string
): Promise<String> => {
	return new Promise((res, rej) => {
		service.videos.insert(
			{
				auth,
				part: ["snippet", "contentDetails", "status"],
				requestBody: {
					// Video title and description
					snippet: {
						title: getTitle(title),
						description: getDescription(title, songUrl),
						tags,
					},
					// set to private for tests
					status: {
						privacyStatus: "public",
					},
				},

				// Create the readable stream to upload the video
				media: {
					body: fs.createReadStream(videoPath), // Change here to your real video
				},
			},
			(error, data) => {
				if (error || !data || !data.data || !data.data.id) {
					return rej(error);
				}
				console.log(
					"Uploaded video: https://www.youtube.com/watch?v=" + data.data.id
				);
				return res(data.data.id);
			}
		);
	});
};

export function getTitle(title: string) {
	return `${title.substring(0, 89)} | #shorts`;
}
export function getDescription(title: string, songUrl: string) {
	return `${title}\n\nSubscribe for a cookie 🍪!\nSong: ${songUrl}`;
}

// tweak tags for algorithm juice
export const tags = [
	"reddit",
	"funny",
	"meme",
	"reddit reading",
	"rediteo",
	"redditeo",
	"voiceover",
	"cool",
	"ama",
	"reddit video",
	"lol",
	"comments",
	"programming",
	"memes",
	"dank",
	"dank memes",
	"r/",
	"reddit/",
	"subreddit",
	"subreddits",
	"funny",
	"r/funny",
	"programmerhumor",
	"r/programmerhumor",
	"memes",
	"r/memes",
	"showerthoughts",
	"r/showerthoughts",
	"dankmemes",
	"r/dankmemes",
	"4chan",
	"r/4chan",
	"greentext",
	"r/greentext",
	"cursedcomments",
	"r/cursedcomments",
	"unexpected",
	"r/unexpected",
	"cursedcomments",
	"r/cursedcomments",
	"diwhy",
	"r/diwhy",
	"crappyoffbrands",
	"r/crappyoffbrands",
];
