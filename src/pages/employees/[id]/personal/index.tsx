import { use, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Sidebar from "~/components/Employees/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { set } from "zod";

interface EmployeePersonalProps {
  query: { id: string };
}

EmployeePersonalPage.getInitialProps = ({ query }: EmployeePersonalProps) => {
  return { query };
};

export default function EmployeePersonalPage({ query }: EmployeePersonalProps) {
  const { data: employee } = api.employee.findOne.useQuery({
    id: query.id,
  });

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!employee) {
      return;
    }
    employee.name && setName(employee.name);
    employee.email && setEmail(employee.email);
    employee.address && setAddress(employee.address);
    employee.phoneNumber && setPhone(employee.phoneNumber);
  }, [employee]);

  const queryClient = useQueryClient();

  const updatePersonalInfo = api.employee?.update.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Personal info updated successfully.", {
        className: "text-xl",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !email || !address || !phone) {
      return toast("Please fill out all the fields.", {
        className: "text-xl",
      });
    }

    updatePersonalInfo.mutate({
      name,
      email,
      address,
      phoneNumber: phone,
      employeeId: query.id,
    });
  }

  if (!employee || !employee.name) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading>
          {employee.name.endsWith("s")
            ? `${employee.name}'`
            : `${employee.name}'s`}{" "}
          Personal Information
        </Heading>

        <form onSubmit={handleSubmit} className="mt-8 w-4/5">
          <label className="text-xl" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          />
          <label className="text-xl" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          />

          <label className="text-xl" htmlFor="address">
            Address
          </label>
          <Input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          />

          <label className="text-xl" htmlFor="phone">
            Phone Number
          </label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          />
          <Button
            size={"lg"}
            title="Update information"
            className="mt-4 h-16 w-full text-3xl"
          >
            Save changes {<Save size={36} className="ml-2" />}
          </Button>
        </form>
      </div>
    </main>
  );
}
