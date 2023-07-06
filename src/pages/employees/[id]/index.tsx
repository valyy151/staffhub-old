import { api } from "~/utils/api";

interface EmployeeProfileProps {
  query: { id: string };
}

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const { data } = api.employee.getUniqueEmployee.useQuery({ id: query.id });

  return <main className="mt-12 text-center text-3xl">{data?.name}</main>;
}
