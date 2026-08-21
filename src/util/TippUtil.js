const assignTotoTippsForSave = (matches) => {
    for (const item of matches) {
        item.heimTipp = 0;
        item.remisTipp = 0;
        item.gastTipp = 0;
        if (item.selectedToto === 1) {
            item.heimTipp = 1;
        } else if (item.selectedToto === 0) {
            item.remisTipp = 1;
        } else if (item.selectedToto === 2) {
            item.gastTipp = 1;
        }
    }
    return matches;
}

const assignTotoTippsForLoad = (matches) => {
    for (const item of matches) {
        item.selectedToto = 1;
        if (item.remisTipp === 1) {
            item.selectedToto = 0;
        } else if (item.gastTipp === 1) {
            item.selectedToto = 2;
        }
    }
    return matches;
}

const retrieveCurrentMatchday = (matchdays) => {
  const currentDate=retrieveCurrentDate();
    console.log("currentDate", currentDate);
   const currentTimeStamp = new Date(currentDate).getTime();
    const greaterMatchdays =matchdays.filter(matchday => {
        let _timestamp = new Date(matchday.startDate).getTime();
        return _timestamp > currentTimeStamp;
    });
    if (greaterMatchdays.length > 0) {
      return greaterMatchdays[0].spieltagNumber;
    } else {
        return matchdays[0].spieltagNumber;
    }
}


const retrieveCurrentDate = () => {
    let timestampNow = Date.now();
    const currentDate = new Date(timestampNow);
    currentDate.setDate(27);
    return currentDate;

}

export {assignTotoTippsForSave,assignTotoTippsForLoad,retrieveCurrentMatchday,retrieveCurrentDate};