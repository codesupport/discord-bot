abstract class EventHandler {
	private readonly event: any;

	protected constructor(event: any) {
		this.event = event;
	}

	abstract handle(...args: any[]): Promise<void>;

	getEvent(): any {
		return this.event;
	}
}

export default EventHandler;