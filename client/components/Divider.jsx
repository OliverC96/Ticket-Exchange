// Divider component used to partition login/registration forms
export default function Divider({ type }) {
    // Vertical divider
    if (type === "vertical") {
        return (
            <div className="flex flex-col items-center py-1 gap-1">
                <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
                <span className="flex-shrink mx-4 text-blue-xlight text-lg"> or </span>
                <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
            </div>
        );
    }
    // Horizontal divider
    else if (type === "horizontal") {
        return (
            <div className="flex items-center py-1">
                <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
                <span className="flex-shrink mx-4 text-blue-xlight"> or </span>
                <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
            </div>
        );
    }
};