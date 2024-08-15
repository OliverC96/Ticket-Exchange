export default function ActionButton ({ Icon, onClick }) {
    return (
        <div
            className="icon-btn justify-center bg-blue-xxdark py-1 w-1/2 rounded-md outline outline-1 outline-blue-light hover:cursor-pointer opacity-80 hover:opacity-100"
            onClick={onClick}
        >
            <Icon size={20}/>
        </div>
    );
}