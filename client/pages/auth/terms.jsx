import { termsAndConditions } from "../../utils/terms";
import { useEffect, useState } from "react";

// Terms and conditions page
export default () => {
    const DATE_OPTIONS = {
        month: "short",
        day: "numeric",
        year: "numeric"
    }
    const [date, setDate] = useState(null);
    useEffect(() => {
        setDate(new Date());
    }, []);
    return (
        <div className="page-wrapper">
            <div className="card p-8 w-4/5 sm:w-3/4 md:w-3/5 h-3/4 overflow-scroll gap-6">
                <div className="flex flex-col lg:flex-row justify-between items-center pb-1 gap-2">
                    <h1 className="text-2xl underline"> Terms and Conditions </h1>
                    <p className="text-lg text-green-400">
                        Last Updated: { date ? date.toLocaleDateString("default", DATE_OPTIONS) : "N/A" }
                    </p>
                </div>
                {
                    termsAndConditions.map((paragraph, index) => (
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-lg">
                                {index + 1}. {paragraph.split(' ').slice(0,2).join(" ")}
                            </p>
                            <p>
                                { paragraph }
                            </p>
                        </div>
                    ))
                }
                <button className="btn-primary !px-6 mt-1 self-end" onClick={() => window.close()}>
                    Finish Registration
                </button>
            </div>
        </div>
    );
}