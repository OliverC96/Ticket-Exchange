# Ticket Exchange

![Auth service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-auth.yml/badge.svg) ![Tickets service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-tickets.yml/badge.svg) ![Orders service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-orders.yml/badge.svg) ![Payments service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-payments.yml/badge.svg) ![Expiration service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-expiration.yml/badge.svg) ![Client service deployment workflow](https://github.com/OliverC96/Ticket-Exchange/actions/workflows/deploy-client.yml/badge.svg)

## Overview

### Core Functionality
- A web application which facilitates the seamless buying and selling of tickets
- Users can create new listings, edit or delete existing listings, and purchase other users' listings
- Powered by six independent microservices, each running within a separate [Docker](https://www.docker.com) container
- Uses [MongoDB](https://www.mongodb.com) to securely store user account credentials, and maintain a comprehensive record of listings, orders, and payments
- Uses [NATS Streaming Server](https://nats.io) to implement asynchronous, event-based communication between services
- Uses [BullJS](https://www.npmjs.com/package/bull) and [Redis](https://redis.io) to implement delayed messaging (in particular, a 15-minute order expiration window)
- Uses [Resend](https://resend.com) to provide email updates; notifying users of significant events (e.g., order confirmation, order refunds)
- Uses [Stripe](https://stripe.com/en-ca) to implement secure checkout (i.e., collecting payment information server-side)
- Uses [Kubernetes](https://kubernetes.io) to manage - and facilitate interactions between - the containerized microservices
- This project was inspired by the [Microservices with Node JS and React](https://www.udemy.com/share/102VKE3@7EmZCLfhgMS8nceqObqL-SLnUUwTL_cQ2PgLDvt3Djbb7731WxXdE-WuEC-NyENJTQ==/) course on Udemy

### UI Colour Palette

- Background (primary): `#003049` ![#003049](https://placehold.co/15x15/003049/003049.png)
- Background (secondary): `#001B29` ![#001B29](https://placehold.co/15x15/001B29/001B29.png)
- Font: `#E0F4FF` ![#E0F4FF](https://placehold.co/15x15/E0F4FF/E0F4FF.png)
- Outline: `#669BBC` ![#669BBC](https://placehold.co/15x15/669BBC/669BBC.png)

## Core Workflow

### Create, Edit, and Delete Listings

- Authenticated users are redirected to the landing page, which displays all currently available listings
  - On this page, users are able to edit or delete their listings (but not other users' listings)
  - Additionally, users can filter and sort listings by price and/or title
- Authenticated users can create listings by clicking on the "Create" link and filling out the subsequent form

### Purchase a Listing

- Clicking on a listing brings up a new page containing the listing details - users can click "Purchase" to initiate the checkout process
- Users are then shown the checkout page, where they have 15 minutes to enter their billing address and payment information to secure the listing
  - Note: if the user fails to complete the checkout stage in this 15-minute window, the order expires, and the ticket is released back into the public marketplace
- If the purchase is successful, the user is shown a new page which displays a brief summary of the order
  - Additionally, the user is sent an email containing all significant order information (see [Email Updates](#email-updates))
- Clicking "View Orders" directs the user to a new page presenting a comprehensive order history

### [Optional] Refund an Order
- If desired, users can request a complete refund for any of their prior orders by clicking the icon on the top-right of the corresponding order card
  - Note: partial refunds (i.e., refunds less than 100% of the original amount) are not supported at this time
- If the refund was successful, the user will receive a notification by email (see [Email Updates](#email-updates))

![Landing page containing all current listings on the platform](./images/landing_page.png)
![Visualization of price-based and keyword-based filtering/sorting on the landing page](./images/listing_filters.png)
![Create a new ticket form](./images/create_form.png)
![Intent to purchase page](./images/purchase_page.png)
![Payment method and billing address form](./images/checkout_form.png)
![Order confirmation page containing a recap of the newly-placed order](./images/order_confirmation.png)
![Order history page](./images/order_history.png)

## User Authentication

Users must be authenticated in order to create, edit, delete, or purchase listings. Returning users can login to their existing accounts by providing valid credentials. New users must complete the registration form to create an account with the application (note: the supplied email address must be unique, i.e., it cannot be tied to another account in the system). Alternatively, users can choose to authenticate through one of the supported third-party sign-in partners (at this time, only Google and GitHub are available).

### Registration

![Registration form for new users](./images/registration_form.png)

In order to complete the registration process, users must read and agree to the application's terms and conditions.

![Terms and conditions](./images/terms_and_conditions.png)

### Login

![Login form for returning users](./images/login_form.png)

Users are able to reset their passwords at any time by clicking the _"Forgot password?"_ link located within the login form. Shortly after, they will receive an email with a link directing them to the password reset form (see below). Upon successful submission of this form, their password will be updated effective immediately (pre-existing sessions will not be expired/invalidated).

_Note:_ only natively-authenticated users are able to reset their passwords. Users authenticated with a third-party partner are unable to make use of this feature (as their password is tied to the third-party platform, and thus, cannot be modified by the application).

![Password reset form](./images/password_reset.png)

## Email Updates

Users will receive emails notifying them of significant events that occur within the [core application workflow](#core-workflow). Users will receive an order confirmation email (containing an order summary and billing details) once an order has been successfully processed. Additionally, users will receive an email notifying them of successful order refunds. The image below provides an example of the order confirmation email (on the left) and the order refund email (on the right).

![Order confirmation and order refunded email updates](./images/email_updates.png)

## Admin Dashboard

Users with administrative privileges have exclusive access to a dashboard page where they can quickly access frequently-used resources (e.g., GitHub, DigitalOcean), and view important application activity (namely, recent events and email updates) at-a-glance. By default, the 10 most recent events and emails are retrieved via the [PostHog API](https://posthog.com/docs/api) - users can request to view additional items (in increments of 10) by clicking the "Show More" button located at the bottom of the corresponding section. This approach reduces the loading of unnecessary information (improving initial page load times), and minimizes queries to PostHog endpoints (avoiding rate limit violations).

![Admin-only dashboard page](./images/admin_dashboard.png)

## Responsive Design

The default [TailwindCSS](https://tailwindcss.com/docs/responsive-design) breakpoints are used to implement responsive design; ensuring a positive user experience on all screen sizes. Most pages are identical in structure across breakpoints, with varying levels of whitespace. Conversely, some pages (in particular, the more complex ones) differ significantly across breakpoints to improve their appearance on smaller screen sizes (examples shown below).

![Mobile view of landing page and admin dashboard](./images/mobile_view.png)

## Event-based Communication

Backend microservices communicate with each other in an asynchronous, event-based fashion. Publishers emit events, and subscribers consume events from their subscriptions (i.e., the channels which they are subscribed to). Queue groups are used to avoid the redundant emission of events to copies of the same service. The following diagram illustrates the flow of events through the event bus.

![A diagram illustrating event-based communication between microservices](./images/event_flow.png)

## Database Models

The following diagram displays the database schema for the models present in each microservice. In order to ensure the services are entirely self-contained (i.e., decoupled), there is some duplication of data within the application. For example, information regarding tickets is stored within both the tickets and orders services. Whenever the orders service requires ticket information (e.g., order creation, which requires a reference to an existing ticket document), it can directly access the ticket from within its own ticket model - effectively circumventing the need for asynchronous communication. In some services, optimistic concurrency control is implemented via a [Mongoose plugin](https://www.npmjs.com/package/mongoose-update-if-current) which increments the version number field whenever a document is modified (to prevent out-of-order updates).

![A diagram detailing all database models utilized in the application](./images/data_models.png)

## Data Persistence

### Kubernetes

[StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) are utilized to achieve data persistence across all services - in both production, and development environments. In each StatefulSet, a Persistent Volume Claim (PVC) is defined; requesting access to some amount of [Persistent Volume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) storage. PVs exist beyond the lifecycle of any individual pod, allowing data to persist in the case of pod/deployment restarts, and/or unexpected server failures. 

_Note:_ [MongoDB Atlas Clusters](https://www.mongodb.com/resources/products/fundamentals/clusters) could also be utilized to achieve data persistence (instead of relying upon StatefulSets and PVCs).

### Redis

[Redis Database (RDB)](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#snapshotting) persistence is configured to save point-in-time snapshots of the Redis instance to the disk after each significant event in the expiration workflow (i.e., whenever the state of the BullJS queue changes). Additionally, [Redis Append-Only File (AOF)](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#append-only-file) persistence is enabled; maintaining a comprehensive log of all write operations received by the Redis server.

### NATS

Currently, NATS Streaming Server is used to manage the transmission of events between microservices. By default, NATS Streaming Server operates entirely in-memory - eliminating the possibility of data persistence. In the future, I plan on investigating the viability of a migration to the newer [NATS Jetstream](https://docs.nats.io/nats-concepts/jetstream) module, which - in conjunction with Kubernetes PVs - could be used to successfully persist events/messages beyond the lifetime of any consumer.

## Testing

[Jest](https://www.npmjs.com/package/jest) and [Supertest](https://www.npmjs.com/package/supertest) are used to perform low-level tests on isolated backend components (e.g., routes, data models, event listeners/publishers), and validate groups of related components within each service.

[Playwright](https://playwright.dev) is used to perform end-to-end testing in an automated fashion; validating the functionality of the application at a high-level (and from a user-facing perspective). All major flows within the [core application workflow](#core-workflow) are targeted (i.e., simulated) in these tests.

## CI/CD

CI/CD is implemented via [GitHub Actions](https://docs.github.com/en/actions/writing-workflows). Whenever a pull request is created (attempting to merge a secondary branch with the main branch), all affected code will be tested automatically (by executing the relevant test suites). For example, if a pull request is created, and only the _orders_ service has been modified, then all tests related to the _orders_ service (and only those tests!) will be executed to ensure it is still functioning as expected after the recent changes. Additionally, whenever a pull request is accepted (i.e., code is pushed into the main branch), new Docker images will be created (to reflect the recent changes), and the affected deployments will be restarted.

## PostHog Analytics

[PostHog](https://posthog.com) is deeply integrated within the application to enable comprehensive event tracking across the frontend, and the various backend services. In addition to autocaptured events (e.g., PageView), custom events are defined to acquire fine-grained insight into user activity. Frontend and backend events are distinguished by nomenclature and the _source_ property. While some events are anonymous (e.g., PageView by an unauthenticated user), most are associated with a particular user in the database (via their unique identifier). PostHog data can be queried using [HogQL](https://posthog.com/blog/introducing-hogql) (a [ClickHouse SQL](https://clickhouse.com/docs/sql-reference) wrapper) to obtain detailed, and personalized insights.

![Snapshot of PostHog dashboard](./images/posthog_dashboard.png)
