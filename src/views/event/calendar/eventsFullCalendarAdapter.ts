interface iEventInput {
    id: string;
    name: string;
    description: string;
    date: string;
    endDate?: string;
    localization: string;
    time: string;
    timeEnd?: string;
    departmentId?: string;
    type?: string;
    category?: {
        id: string;
        name: string;
    };
}

export const eventsFullCalendarAdapter = (events: iEventInput[]) => {
  return events.map((event) => {
    const startDate = new Date(event.date);
    const startDateWithTime = new Date(event.time);
    startDate.setHours(startDateWithTime.getHours(), startDateWithTime.getMinutes(), 0, 0);

    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    const endDateWithTime = event.timeEnd ? new Date(event.timeEnd) : startDateWithTime;
    endDate.setHours(endDateWithTime.getHours(), endDateWithTime.getMinutes(), 0, 0);

    return {
        title: event.name,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        extendedProps: {
            id: event.id,
            department: event.category?.name,
        },
        allDay: false,
    };
  });
};

