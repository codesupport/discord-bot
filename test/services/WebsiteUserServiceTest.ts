import {createSandbox, SinonSandbox} from "sinon";
import {expect} from "chai";

import WebsiteUserService from "../../src/services/WebsiteUserService";

describe("WebsiteUserService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of WebsiteUserService", () => {
			const service = WebsiteUserService.getInstance();

			expect(service).to.be.instanceOf(WebsiteUserService);
		});
	});

	describe("buildProfileURL()", () => {
		let sandbox: SinonSandbox;
		let websiteUserService: WebsiteUserService;

		beforeEach(() => {
			sandbox = createSandbox();
			websiteUserService = WebsiteUserService.getInstance();
		});

		it("Generates url containing profile name", async () => {
			const mockArticle = {
				createdBy: {
					alias: "userAwesome"
				}
			};

			const result = await websiteUserService.buildProfileURL(mockArticle.createdBy.alias);

			expect(result).to.equal("https://codesupport.dev/profile/userawesome");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});