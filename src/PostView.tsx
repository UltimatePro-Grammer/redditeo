import {
	Audio,
	getInputProps,
	Img,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Comment } from "./Helpers/Comment";
import { InputProps } from "./Helpers/InputProps";
import { Text } from "./Helpers/Text";
import { useProgress } from "./Helpers/useProgress";

const titleTTS = staticFile("/title.mp3");
const commentTTS = staticFile("/comment.mp3");
const backgroundMusic = staticFile("/music.mp3");

export const PostView = ({
	postSeconds,
	titleTTSDuration,
	commentTTSDuration,
}: {
	postSeconds: number;
	titleTTSDuration?: number;
	commentTTSDuration?: number;
}) => {
	const { post, comment } = getInputProps() as InputProps;
	const { title, user, subreddit, imageUrl } = post;

	const progress = useProgress();
	const frame = useCurrentFrame();
	const { durationInFrames, fps } = useVideoConfig();
	const framesUntilComment = fps * postSeconds;
	const commentTop = interpolate(
		frame,
		[0, framesUntilComment, framesUntilComment + 10, durationInFrames],
		[100, 100, 0, 0]
	);

	return (
		<div
			style={{
				flex: 1,
				textAlign: "center",
				background: "#444444",
				color: "white",
				fontFamily: "Roboto",
			}}
		>
			{/* Blurred bg image */}
			<Img
				style={{
					width: "120%",
					height: "120%",
					position: "absolute",
					top: `calc(-5% + ${progress * -10}%)`,
					left: "-5%",
					zIndex: "0",
					filter: `blur(24px) hue-rotate(-${
						5 + progress * 50
					}deg) brightness(0.8)`,
					objectFit: "cover",
					transform: `scale(${1 + progress * 0.05})`,
				}}
				src={imageUrl}
			/>

			{/* Main image/comment */}
			<Img
				style={{
					width: "100%",
					height: "75%",
					objectFit: "contain",
					position: "relative",
					filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.75))",
					zIndex: "2",
					bottom: `${100 - commentTop}%`,
				}}
				src={imageUrl}
			/>
			<Comment {...comment} topOffset={commentTop} />

			{/* Text */}
			<div
				style={{
					position: "absolute",
					width: "100%",
					bottom: "6%",
				}}
			>
				<Text randomColor>{title}</Text>
			</div>

			{/* User+subreddit */}
			<div
				style={{
					position: "absolute",
					bottom: "3%",
					left: "0%",
					width: "100%",
				}}
			>
				<Text style={{ fontSize: "2.5em" }}>
					{user} on {subreddit}
				</Text>
			</div>

			{/* Audio */}
			<Audio
				src={backgroundMusic}
				endAt={durationInFrames * fps}
				volume={0.3}
			/>
			<Sequence
				from={fps}
				name={"title.mp3"}
				durationInFrames={titleTTSDuration}
			>
				<Audio src={titleTTS} />
			</Sequence>
			<Sequence
				from={framesUntilComment + fps}
				name={"comment.mp3"}
				durationInFrames={commentTTSDuration}
			>
				<Audio src={commentTTS} />
			</Sequence>
		</div>
	);
};
