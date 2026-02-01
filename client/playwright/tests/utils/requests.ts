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

const orderRequests: Request[] = [
    {
        method: "get",
        path: "/api/orders"
    },
    {
        method: "post",
        path: "/api/orders",
        data: {
            ticketID: process.env.TEST_TICKET_ID
        }
    },
    {
        method: "patch",
        path: `/api/orders/${process.env.TEST_ORDER_ID}`
    },
    {
        method: "get",
        path: `/api/orders/${process.env.TEST_ORDER_ID}`
    }
]

const paymentRequests: Request[] = [
    {
        method: "post",
        path: "/api/payments",
        data: {
            tokenID: process.env.TEST_TOKEN_ID,
            orderID: process.env.TEST_ORDER_ID
        }
    }
]

export {
    Request,
    ticketRequests,
    orderRequests,
    paymentRequests
};