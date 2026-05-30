const saveMessage = (error) => {
    const data =
        {
            errorMessage: null,
            errorDetails: null,
            message: null
        }

    if (error.response && error.response.data) {
        const problem = error.response.data;
        console.log("saveMessage:problem ", JSON.stringify(problem));
        // 1. Extract standard RFC 7807 fields

        data.errorMessage = problem.title;
        data.errorDetails = problem.detail;
        console.log("typeof: data.errorDetails", typeof problem.detail);
        console.log("saveMessage: data.errorDetails", JSON.stringify( data.errorDetails));
        data.message = problem.message;


    }
    console.log("saveMessage:return {}", JSON.stringify(data));
    return data;
}
export {saveMessage}