import { useEffect, useState } from "react";
import WorkDay from "~/components/WorkDay/WorkDay";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

interface WorkDayPageProps {
  query: { id: string };
}

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const [workDay, setWorkDay] = useState<any>({});

  const { data } = api.workDay.findOne.useQuery({ id: query.id });

  useEffect(() => {
    if (data) {
      setWorkDay(data);
      setLoading(false);
    }
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : (
        <WorkDay data={workDay} setWorkDay={setWorkDay} />
      )}
    </main>
  );
}
