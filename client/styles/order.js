const getStatusColour = (currStatus) => {
    switch (currStatus) {
        case "created":
            return "text-blue-xlight";
        case "cancelled":
            return "text-red-400";
        case "complete":
            return "text-green-400";
    }
};

export { getStatusColour };