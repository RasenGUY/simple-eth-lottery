export function timeDifference(tsStart, tsEnd){
    const startDate = new Date(tsStart * 1000);
    const endDate = new Date(tsEnd * 1000);
    return (endDate.getTime() - startDate.getTime()) / 1000;
} // returns difference between two timestamps in seconds