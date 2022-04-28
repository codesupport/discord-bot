import schedule from "node-schedule";

function Schedule(crontab: string) {
	return (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) => {
		schedule.scheduleJob(crontab, descriptor.value);
	};
}

export default Schedule;