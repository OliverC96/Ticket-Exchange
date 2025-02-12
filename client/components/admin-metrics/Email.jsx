// Encapsulates a single email retrieved from the PostHog API
export default ({ recipient, subject, timestamp }) => {
    return (
        <div className="px-5 flex flex-col sm:flex-row gap-1 sm:gap-8 whitespace-nowrap overflow-auto justify-between">
            <p> {recipient} </p>
            <p><i>{subject}</i></p>
            <p> {timestamp} </p>
        </div>
    );
}