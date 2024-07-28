export default function Metadata({ orderID }) {
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const currDate = new Date();
    return (
        <div id="metadata" className="flex justify-between">
            <h3> { MONTHS[currDate.getMonth()] } { currDate.getDate() }, { currDate.getFullYear() } </h3>
            <h3> #{orderID} </h3>
        </div>
    );
}