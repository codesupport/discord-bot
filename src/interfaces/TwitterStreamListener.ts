interface TwitterStreamListener {
	id_str: string;
	extended_tweet: {
		full_text: string;
	};
}

export default TwitterStreamListener;