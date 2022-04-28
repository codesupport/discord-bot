import { createSandbox, SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import schedule from "node-schedule";
import Schedule from "../../src/decorators/Schedule";

describe("@Schedule()", () => {
	let sandbox: SinonSandbox;
	let scheduleJobStub: SinonStub;

	beforeEach(() => {
		sandbox = createSandbox();
		scheduleJobStub = sandbox.stub(schedule, "scheduleJob").returns({});
	});

	afterEach(() => sandbox.restore());

	it("schedules a job with the given crontab", () => {
		class Test {
			@Schedule("0 0 * * *")
			doSomething() {
				console.log("test");
			}
		}

		expect(scheduleJobStub.calledOnce).to.be.true;
		expect(scheduleJobStub.args[0][0]).to.equal("0 0 * * *");
	});

	it("schedules a job to run the decorated method", () => {
		class Test {
			@Schedule("0 0 * * *")
			doSomething() {
				console.log("test");
			}
		}

		expect(scheduleJobStub.args[0][1]).to.equal(Test.prototype.doSomething);
	});
});