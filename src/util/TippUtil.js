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

export {assignTotoTippsForSave,assignTotoTippsForLoad};