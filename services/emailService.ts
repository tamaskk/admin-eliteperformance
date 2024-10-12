export const getNewsLetterEmails = async () => {
    const response = await fetch("/api/email/getNewsLetterEmail");
  
    if (!response.ok) {
        throw new Error("Something went wrong");
    }
  
    return response.json();
}

export const getNewsLetterEmailsXLSX = async () => {
    const response = await fetch("/api/email/getNewsLetterEmailCSV");
  
    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.blob();
};
