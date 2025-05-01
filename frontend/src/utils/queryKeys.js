// fetched data will get cached corresponding to these keys

// when updating data, invalidate the query key which will automatically be refetched
//  for ex: changing appointment from pending to confirmed, invalidate the all key,
//  all appointments will be refetched and the new data will be automatically displayed throughout the app.
//  (it will call the queryFn in the useQuery hook)
export const queryKeys = {
    appointments: {
        all: ["appointments"],
        pending: (doctorId) => ["appointments", "pending", doctorId],
        confirmed: (doctorId) => ["appointments", "confirmed", doctorId],
        // cancelled: (doctorId) => ["appointments", "cancelled", doctorId],
    },
    pharmacies: {
        all: ["pharmacies"]
    },
    recipes:{
        all: ["recipes"],
        comments: (recipeId) => ["recipes","comments",recipeId],
        ingredients: (recipeId) => ["recipes","ingredients",recipeId]

    },
    ingredients:{
        all:["ingredients"]
    },
    mealplans:{
        all:["mealplans"]
    },
    daily_surveys:{
        all:["daily_surveys"],
        did:["daily_surveys","did"],
    },
    weekly_surveys:{
        all:["weekly_surveys"],
        did:["weekly_surveys","did"],
    }

    drugs:{
        all: ["drugs"]
    }


};
