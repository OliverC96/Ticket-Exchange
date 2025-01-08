import { useState, useEffect } from "react";
import { queryPosthog } from "../../utils/queryPosthog";
import ReloadButton from "./ReloadButton";
import SkeletonEmail from "./SkeletonEmail";
import SkeletonEvent from "./SkeletonEvent";
import Email from "./Email";
import Event from "./Event";

// Generalized metric component
export default ({ type }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [greenLight, setGreenLight] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    // Number of skeleton components to display during the data fetching process
    const NUM_RESULTS = 10;

    // HogQL query to retrieve, and aggregate relevant event information (10 at a time)
    const eventsQuery = `
        SELECT e.event, e.properties, e.timestamp, p.properties, (SELECT COUNT(*) FROM events WHERE event NOT LIKE '$%')
        FROM events AS e
        INNER JOIN persons AS p
        ON e.person_id = p.id
        WHERE e.event NOT LIKE '$%' 
        ORDER BY e.timestamp DESC 
        LIMIT 10
        OFFSET ${offset}
    `;

    // HogQL query to retrieve, and aggregate relevant email information (10 at a time)
    const emailQuery = `
        SELECT properties, timestamp, (SELECT COUNT(*) FROM events WHERE event = 'email_sent')
        FROM events
        WHERE event = 'email_sent'
        ORDER BY timestamp DESC
        LIMIT 10
        OFFSET ${offset}
    `;

    // Helper method to parse emails retrieved from the PostHog API
    const parseEmails = (data) => {
        const emails = [];
        for (let event of data.results) {
            event[0] = JSON.parse(event[0]);
            emails.push({
                recipient: event[0].recipientEmail,
                subject: event[0].subject,
                timestamp: new Date(event[1]).toLocaleString()
            });
            setTotalResults(event[2]);
        }
        return emails;
    }

    // Helper method to parse events retrieved from the PostHog API
    const parseEvents = (data) => {
        const events = [];
        for (let event of data.results) {
            const properties = JSON.parse(event[1]);
            for (const key of Object.keys(properties)) {
                if ((key.charAt(0) === '$') || (key === "token") || (key === "distinct_id") || (key.toLowerCase().includes("email"))) delete properties[key];
            }
            event[1] = Object.entries(properties);
            event[2] = new Date(event[2]).toLocaleString();
            event[3] = JSON.parse(event[3]).email;
            events.push(event);
            setTotalResults(event[4]);
        }
        return events;
    }

    // Fetches data from PostHog, parses the resulting response, and updates state accordingly
    const fetchData = async () => {
        setLoading(true);
        const data = await queryPosthog({
            query: type === "Emails" ? emailQuery : eventsQuery
        });
        if (type === "Emails") {
            setData(parseEmails(data));
        }
        else if (type === "Events") {
            const events = parseEvents(data);
            setData(data => data.concat(events));
        }
        setOffset(offset => offset + 10);
        setLoading(false);
    }

    // Initiate the data fetching process whenever one of the following events occur:
    // 1) Initial page load (i.e., component mount)
    // 2) "Reload" button is clicked by the user
    // 3) "Show More" button is clicked by the user
    useEffect(() => {
        if (greenLight) {
            fetchData();
            setGreenLight(false);
        }
    }, [greenLight]);

    return (
        <div className="flex flex-col gap-6 w-[55%] text-lg">
            <div className="flex gap-5">
                <h1 className="text-2xl"> { type } </h1>
                <ReloadButton onClick={() => {
                    setOffset(0);
                    setTotalResults(0);
                    setData([]);
                    setGreenLight(true);
                }}/>
            </div>
            <div className="metrics-container">
                <div className="flex flex-col gap-5">
                    {loading && Array(NUM_RESULTS).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col gap-5">
                            {type === "Emails"
                                ? <SkeletonEmail />
                                : <SkeletonEvent />
                            }
                            {i !== NUM_RESULTS - 1 &&
                                <div className="admin-divider"/>
                            }
                        </div>
                    ))}
                    {!loading && data.map((item, index) => (
                        <div key={index}>
                            {type === "Emails"
                                ? <Email {...item} />
                                : <Event event={item} />
                            }
                            {index !== data.length - 1 &&
                                <div className="admin-divider mt-5"/>
                            }
                        </div>
                    ))}
                    {data.length < totalResults &&
                        <button
                            className="btn-primary mx-5 mt-2 text-base"
                            onClick={() => setGreenLight(true)}
                        >
                            Show More
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}