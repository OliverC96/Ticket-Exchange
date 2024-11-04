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
        price: [10, 20, 30, 40, 50, 60, 70, 80, 90][Math.floor(Math.random() * 9)],
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