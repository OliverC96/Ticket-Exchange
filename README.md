# Ticket Exchange <a href="https://www.ticket-exchange.ca"> [https://www.ticket-exchange.ca] </a>

### Overview
- A web application which facilitates the seamless buying and selling of tickets
- Users can create new listings, edit or delete existing listings, and purchase other users' listings
- Powered by six independent microservices (detailed in Event-based Communication)
- Uses **MongoDB** to securely store user account credentials, and maintain a comprehensive record of listings, orders, and payments
- Uses **NATS Streaming Server** to implement asynchronous, event-based communication between services
- Uses **BullJS** and **Redis** to implement delayed messaging (in particular, a 15-minute order expiration window)

### UI Colour Palette

- Background (primary): `#003049`
- Background (secondary): `#001B29`
- Font: `#E0F4FF`
- Outline: `#669BBC`

## Core Workflow

![Landing page containing all current listings on the platform](./images/landing_page.png)
![Create a new ticket form](./images/create_form.png)
![Intent to purchase page](./images/purchase_page.png)
![Payment method and billing address form](./images/checkout_form.png)
![Order confirmation page containing a recap of the newly-placed order](./images/order_confirmation.png)
![Order history page](./images/order_history.png)

## User Authentication

![Registration form for new users](./images/registration_form.png)
![Login form for returning users](./images/login_form.png)

## Email Updates

![Order confirmation and order refunded email updates](./images/email_updates.png)

## Event-based Communication

![A diagram illustrating event-based communication between microservices](./images/event_flow.png)

## Database Models

![A diagram detailing all database models utilized in the application](./images/data_models.png)

## Data Persistence

### Redis

### NATS Streaming Server

### Kubernetes
