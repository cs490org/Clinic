export const queryKeys = {
    appointments: {
        all: ["appointments"],
        pending: (doctorId) => ["appointments", "pending", doctorId],
        confirmed: (doctorId) => ["appointments", "confirmed", doctorId],
        // cancelled: (doctorId) => ["appointments", "cancelled", doctorId],
    },
};
