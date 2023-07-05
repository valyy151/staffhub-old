import NewEmployeeForm from "~/components/Employees/NewEmployeeForm";
import Heading from "~/components/ui/Heading";

export default function NewEmployeePage() {
  return (
    <>
      <Heading className="mt-12 text-center">Create an Employee</Heading>
      <NewEmployeeForm />
    </>
  );
}
