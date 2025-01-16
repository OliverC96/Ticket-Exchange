// Displays order metadata (namely, order ID and time of purchase)
export default function Metadata({ orderID, d }) {
    return (
        <div className="text-center text-lg font-bold">
            { orderID && <p> Order #{orderID} </p> }
            <p className="-mt-3"> {d.day} {d.date} {d.month} {d.year} @ {d.hours}:{d.minutes} {d.tag} </p>
        </div>
    );
}