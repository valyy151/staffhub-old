import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import { DashboardWorkDay, api } from "~/utils/api";
import { buttonVariants } from "~/components/ui/Button";
import Dashboard from "~/components/Dashboard/Dashboard";

const DashboardPage = () => {
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [workDays, setWorkDays] = useState<DashboardWorkDay[]>([]);
  const [smallLoading, setSmallLoading] = useState<boolean>(false);

  const { data } = api.dashboard.find.useQuery({
    skip: skip,
  });

  useEffect(() => {
    setSmallLoading(true);
    if (data) {
      setWorkDays(data);
      setLoading(false);
      setSmallLoading(false);
    }
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : workDays.length > 0 ? (
        <Dashboard
          skip={skip}
          data={workDays}
          setSkip={setSkip}
          loading={smallLoading}
        />
      ) : (
        <>
          <Heading className="mt-6" size={"sm"}>
            You do not currently have any created schedules.
          </Heading>
          <Heading size={"xs"} className="mt-2">
            Click below if you wish to create a schedule.
          </Heading>
          <Link className={`${buttonVariants()} mt-4`} href="/schedule">
            New Schedule {<CalendarPlus className="ml-2" />}
          </Link>
        </>
      )}
    </main>
  );
};

export default DashboardPage;
