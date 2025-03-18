// Dynamic footer component displaying copyright statement
export default function Footer() {
    const currYear = new Date().getFullYear();
    return (
        <div className="text-blue-xlight text-lg flex justify-center items-center h-[10vh] -mt-[10vh] opacity-75">
            ⓒ {currYear} Oliver Clennan
        </div>
    );
}