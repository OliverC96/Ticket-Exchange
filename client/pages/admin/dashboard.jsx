import { adminLinks } from "../../utils/admin_links";
import MetricCard from "../../components/admin-metrics/MetricCard";

// Admin dashboard containing relevant metrics and other useful information
const AdminDashboard = () => {
    return (
        <div className="page-wrapper">
            <div className="w-4/5 md:w-[70%] flex flex-col gap-10 pb-[5vh] pt-[10vh]">
                {/* Quick links to frequently used software */}
                <div id="quick-links" className="flex flex-col gap-6">
                    <h1 className="text-2xl"> Quick Links </h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-xl">
                        {adminLinks.map((link, index) => {
                            const {name, url, Icon} = link;
                            return (
                                <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="external nofollow"
                                    className="quick-link"
                                >
                                    <Icon />
                                    {name}
                                </a>
                            );
                        })}
                    </div>
                </div>
                {/* Relevant metrics; in particular, recent emails and events */}
                <div id="metrics" className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-5 footer-buffer">
                    <MetricCard type="Events" />
                    <MetricCard type="Emails" />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;