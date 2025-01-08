// Encapsulates a single event retrieved from the PostHog API
export default ({ event }) => {
    const [eventName, properties, timestamp, userEmail] = event;
    return (
        <div className="flex flex-col gap-1 px-5">
            <div className="flex justify-between text-lg">
                <p className="text-green-400"> {eventName} </p>
                <p> {timestamp} </p>
            </div>
            <p className="text-lg"> {userEmail} </p>
            {properties &&
                <ul className="list-disc list-inside pl-4 opacity-80 marker:opacity-80">
                    {properties.map(([name, value], index) => (
                        <li key={index}> {name}: {value} </li>
                    ))}
                </ul>
            }
        </div>
    );
}