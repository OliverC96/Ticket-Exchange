# Ticket Exchange

### Overview
- A web application which facilitates the seamless buying and selling of tickets
- Users can create new listings, edit or delete existing listings, and purchase other users' listings
- Powered by six independent microservices, each running within a separate [Docker](https://www.docker.com) container
- Uses [MongoDB](https://www.mongodb.com) to securely store user account credentials, and maintain a comprehensive record of listings, orders, and payments
- Uses [NATS Streaming Server](https://nats.io) to implement asynchronous, event-based communication between services
- Uses [BullJS](https://www.npmjs.com/package/bull) and [Redis](https://redis.io) to implement delayed messaging (in particular, a 15-minute order expiration window)
- Uses [Resend](https://resend.com) to provide email updates; notifying users of significant events (e.g., order confirmation, order refunds)
- Uses [Stripe](https://stripe.com/en-ca) to implement secure checkout (i.e., collecting payment information server-side)
- Uses [Kubernetes](https://kubernetes.io) to manage - and facilitate interactions between - the containerized microservices

### UI Colour Palette

- Background (primary): `#003049`
- Background (secondary): `#001B29`
- Font: `#E0F4FF`
- Outline: `#669BBC`

## Core Workflow

- Authenticated users are redirected to the landing page, which displays all currently available listings
  - On this page, users are able to edit or delete their listings (but not other users' listings)
- Authenticated users can create listings by clicking on the "Create" link and filling out the subsequent form
- Clicking on a listing brings up a new page containing the listing details - users can click "Purchase" to initiate the checkout process
- Users are then shown the checkout page, where they have 15 minutes to enter their billing address and payment information to secure the listing
  - Note: if the user fails to complete the checkout stage in this 15-minute window, the ticket is released back into the public marketplace
- If the purchase is successful, the user is shown a new page which displays a brief summary of the order
  - Additionally, the user is sent an email containing all significant order information
- Clicking "View Orders" directs the user to a new page presenting a comprehensive order history
- If desired, users can request a complete refund for any of their prior orders by clicking the icon on the top-right of the corresponding order card
  - Note: partial refunds (i.e., refunds less than 100% of the original amount) are not supported at this time
  - If the refund was successful, the user will receive a notification by email

![Landing page containing all current listings on the platform](./images/landing_page.png)
![Create a new ticket form](./images/create_form.png)
![Intent to purchase page](./images/purchase_page.png)
![Payment method and billing address form](./images/checkout_form.png)
![Order confirmation page containing a recap of the newly-placed order](./images/order_confirmation.png)
![Order history page](./images/order_history.png)

## User Authentication

Un-authenticated users are only able to view listings. Users must be authenticated in order to create, edit, delete, or purchase listings. Returning users can login to their existing accounts by providing valid credentials. New users must complete the registration form to create an account with the application (note: the supplied email address must be unique, i.e., it cannot be tied to another account in the system).

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

## Testing

## CI/CD
