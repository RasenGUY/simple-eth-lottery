export function range(start, end, interval=0){
    let arr = [];
    interval = interval > 0 ? interval - 1 : 0;
    for(let i=start; i < end; i++){
        arr.push(i);
        i+=interval;
    }
    return arr;
}