import { useEffect, useState } from "react";
import WorkDay from "~/components/WorkDay/WorkDay";
import { api } from "~/utils/api";

interface WorkDayPageProps {
  query: { id: string };
}

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [workDay, setWorkDay] = useState<any>({});

  const { data } = api.workDay.findOne.useQuery({ id: query.id });

  useEffect(() => {
    if (data) {
      setWorkDay(data);
    }
  }, [data]);

  return <WorkDay data={workDay} setWorkDay={setWorkDay} />;
}
