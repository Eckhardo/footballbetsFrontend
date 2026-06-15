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
        data.message = problem.message;


    }

    return data;
}
export {saveMessage}