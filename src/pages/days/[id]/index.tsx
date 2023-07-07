import { useState } from "react";
import WorkDay from "~/components/WorkDay/WorkDay";
import { api } from "~/utils/api";

interface WorkDayPageProps {
  query: { id: string };
}

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const { data } = api.employee.findOne.useQuery({ id: query.id });
  const [loading, setLoading] = useState<boolean>(false);

  const [workDay, setWorkDay] = useState<{
    id: string;
    date: number;
    shifts: [];
  }>({ id: "", date: 0, shifts: [] });

  return (
    <WorkDay
      data={workDay}
      loading={loading}
      setWorkDay={setWorkDay}
      setLoading={setLoading}
    />
  );
}
