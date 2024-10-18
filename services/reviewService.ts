export const getReviews = async () => {
    try {
        const response = await fetch("/api/reviews/getReviews");
        const reviews = await response.json();
        return reviews
    } catch (error) {
        console.log(error);
    }
};

export const addReview = async (reviews: any) => {
    try {
        const response = await fetch("/api/reviews/addReview", {
            method: "POST",
            body: JSON.stringify({reviews}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const removeReview = async (name: string) => {
    try {
        const response = await fetch("/api/reviews/removeReview", {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateReview = async (reviews: any) => {
    try {
        const response = await fetch("/api/reviews/updateReview", {
            method: "POST",
            body: JSON.stringify({ data: reviews }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}