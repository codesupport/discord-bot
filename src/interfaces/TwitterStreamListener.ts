interface TwitterStreamListener {
	id_str: string;
	text: string;
	extended_tweet?: {
		full_text: string;
	};
}

export default TwitterStreamListener;