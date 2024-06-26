export default function Footer() {
    const currYear = new Date().getFullYear();
    return (
        <h3 className="text-black"> © { currYear } Oliver Clennan </h3>
    )
}