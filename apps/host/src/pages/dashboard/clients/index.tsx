import React from "react";
import DashboardLayout from "@/pages/components/dashboard-layout";
import dynamic from "next/dynamic";

const Table = dynamic(() => import("remote/table"), {
  ssr: false,
});

const AnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout title="Clients">
      <Table />
    </DashboardLayout>
  );
};

export default AnalyticsPage;
