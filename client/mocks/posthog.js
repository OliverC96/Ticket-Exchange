const getEvents = (numEvents) => {
    const testEvent = [
        "thisIsATestUUID$@#",
        "password_reset_requested",
        [
            ["distinct_id", "67671877c386bbe30ca476c2"],
            ["minPrice", 40],
            ["maxPrice", 90]
        ],
        new Date().toLocaleString(),
        "clennanoliver@gmail.com"
    ];
    return Array(numEvents).fill(testEvent);
};

const getEmails = (numEmails) => {
    const testEmail = {
        recipient: "admin@gmail.com",
        subject: "Password Reset Requested",
        timestamp: new Date().toLocaleString()
    }
    return Array(numEmails).fill(testEmail);
}

export { getEvents, getEmails };