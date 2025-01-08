// Encapsulates a single email retrieved from the PostHog API
export default ({ recipient, subject, timestamp }) => {
    return (
        <div className="flex justify-between px-5">
            <p> {recipient} </p>
            <p><i>{subject}</i></p>
            <p> {timestamp} </p>
        </div>
    );
}