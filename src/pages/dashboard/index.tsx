import { WorkDay } from "@prisma/client";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dashboard from "~/components/Dashboard/Dashboard";
import { buttonVariants } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

interface Shift {
  end: number;
  start: number;
  count: number;
  employee: { name: string };
}

const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);

  const { data } = api.workDay.find.useQuery({ skip: 0 });

  console.log(data);

  useEffect(() => {
    if (data) {
      setWorkDays(data);
    }
    setLoading(false);
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : workDays.length > 0 ? (
        <Dashboard data={workDays} />
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
