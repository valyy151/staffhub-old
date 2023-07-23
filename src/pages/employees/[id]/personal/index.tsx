import { useState } from "react";
import { api } from "~/utils/api";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Sidebar from "~/components/Employees/Sidebar";
import { useQueryClient } from "@tanstack/react-query";

interface EmployeePersonalInfoPageProps {
  query: { id: string };
}

EmployeePersonalInfoPage.getInitialProps = ({
  query,
}: EmployeePersonalInfoPageProps) => {
  return { query };
};

export default function EmployeePersonalInfoPage({
  query,
}: EmployeePersonalInfoPageProps) {
  const response = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const employee: any = response.data;

  const [name, setName] = useState<string>(employee?.name);
  const [email, setEmail] = useState<string>(employee?.email);
  const [phone, setPhone] = useState<string>(employee?.phoneNumber);
  const [address, setAddress] = useState<string>(employee?.address);

  const queryClient = useQueryClient();

  const updatePersonalInfo = api.employee?.updatePersonalInfo.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Personal info updated successfully.");
    },
  });

  const handleSubmit = async () => {
    updatePersonalInfo.mutate({
      name,
      email,
      address,
      phoneNumber: phone,
      employeeId: query.id,
    });
  };

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mx-auto mt-4 flex w-full flex-col items-center">
        <Heading>{employee?.name}</Heading>

        <form onSubmit={handleSubmit} className="mt-12 w-1/4">
          <label className="text-xl" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 h-16 text-xl"
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
            className="mb-2 h-16 text-xl"
          />
          <label className="text-xl" htmlFor="phone">
            Phone
          </label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-2 h-16 text-xl"
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
            className="mb-2 h-16 text-xl"
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
