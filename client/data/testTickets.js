const titles= [
    "Rock Concert",
    "Blues Concert",
    "Rap Concert",
    "Country Concert",
    "Folk Concert",
    "Soccer Match",
    "Football Match",
    "Tennis Match",
    "Basketball Match",
    "Wrestling Match"
];

const createTicket = (id, title) => {
    return {
        id,
        title,
        price: Math.floor(Math.random() * 100) + 1,
        status: "Available"
    };
};

let testTickets = [];
let i = 1;

titles.forEach((title) => {
    const ticket = createTicket(i, title);
    testTickets.push(ticket);
    i++;
});

export { testTickets };