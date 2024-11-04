type Request = {
    method: string,
    path: string,
    data?: object
}

const ticketRequests: Request[] = [
    {
        method: "post",
        path: "/api/tickets",
        data: {
            title: "Unauthorized Ticket",
            price: 200
        }
    },
    {
        method: "put",
        path: `/api/tickets/${process.env.TEST_TICKET_ID}`,
        data: {
            title: "Updated Ticket",
            price: 100
        }
    },
    {
        method: "delete",
        path: `/api/tickets/${process.env.TEST_TICKET_ID}`
    }
];

export {
    ticketRequests
};