class WebsiteUserService {
	private static instance: WebsiteUserService;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): WebsiteUserService {
		if (!this.instance) {
			this.instance = new WebsiteUserService();
		}

		return this.instance;
	}

	public buildProfileURL(user: string): string {
		return `https://codesupport.dev/profile/${user.toLowerCase()}`;
	}
}

export default WebsiteUserService;