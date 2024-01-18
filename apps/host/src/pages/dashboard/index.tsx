import React from "react";
import {
  Card,
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Metric,
  Flex,
  ProgressBar,
  AreaChart,
  Title,
  LineChart,
} from "@tremor/react";
import DashboardLayout from "@/pages/components/dashboard-layout";

const chartdata2 = [
  {
    date: "Jan 22",
    SemiAnalysis: 2890,
    "The Pragmatic Engineer": 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    "The Pragmatic Engineer": 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    "The Pragmatic Engineer": 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    "The Pragmatic Engineer": 2108,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    "The Pragmatic Engineer": 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    "The Pragmatic Engineer": 1726,
  },
];

const valueFormatter2 = function (number: number) {
  return "$ " + new Intl.NumberFormat("us").format(number).toString();
};

const chartdata = [
  {
    year: 1970,
    "Export Growth Rate": 2.04,
    "Import Growth Rate": 1.53,
  },
  {
    year: 1971,
    "Export Growth Rate": 1.96,
    "Import Growth Rate": 1.58,
  },
  {
    year: 1972,
    "Export Growth Rate": 1.96,
    "Import Growth Rate": 1.61,
  },
  {
    year: 1973,
    "Export Growth Rate": 1.93,
    "Import Growth Rate": 1.61,
  },
  {
    year: 1974,
    "Export Growth Rate": 1.88,
    "Import Growth Rate": 1.67,
  },
  //...
];

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout title="Welcome to Dashboard👋">
      {/* <div className="w-full min-h-[120vh] dark:bg-slate-700 rounded bg-slate-200"></div> */}
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
            </Grid>
            <div className="mt-6">
              <Card>
                <Title>Newsletter revenue over time (USD)</Title>
                <AreaChart
                  className="h-72 mt-4"
                  data={chartdata2}
                  index="date"
                  yAxisWidth={65}
                  categories={["SemiAnalysis", "The Pragmatic Engineer"]}
                  colors={["indigo", "cyan"]}
                  valueFormatter={valueFormatter2}
                />
              </Card>
            </div>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
            </Grid>
            <div className="mt-6">
              <Card>
                <Title>Export/Import Growth Rates (1970 to 2021)</Title>
                <LineChart
                  className="mt-6"
                  data={chartdata}
                  index="year"
                  categories={["Export Growth Rate", "Import Growth Rate"]}
                  colors={["emerald", "gray"]}
                  valueFormatter={valueFormatter}
                  yAxisWidth={40}
                />
              </Card>
            </div>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
              <Card className="max-w-lg mx-auto">
                <Text>Sales</Text>
                <Metric>$ 71,465</Metric>
                <Flex className="mt-4">
                  <Text>32% of annual target</Text>
                  <Text>$ 225,000</Text>
                </Flex>
                <ProgressBar value={32} className="mt-2" />
              </Card>
            </Grid>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title>Newsletter revenue over time (USD)</Title>
                <AreaChart
                  className="mt-4 h-96"
                  data={chartdata2}
                  index="date"
                  yAxisWidth={65}
                  categories={["SemiAnalysis", "The Pragmatic Engineer"]}
                  colors={["indigo", "cyan"]}
                  valueFormatter={valueFormatter2}
                />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </DashboardLayout>
  );
};

export default DashboardPage;
