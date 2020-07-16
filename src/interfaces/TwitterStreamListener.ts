interface TwitterStreamListener {
	id_str: string;
	text: string;
	user: {
		id_str: string;
	};
	extended_tweet?: {
		full_text: string;
	};
	retweeted_status?: {
		id_str: string;
	};
}

export default TwitterStreamListener;