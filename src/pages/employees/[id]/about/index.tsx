import { Employee } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check, MoreVertical, X } from "lucide-react";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import Dropdown from "~/components/Employees/Dropdown";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";

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
  const { data: employee }: any = api.employee?.findOne.useQuery({
    id: query.id,
  });
  const [modal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>(employee?.name);
  const [email, setEmail] = useState<string>(employee?.email);
  const [phone, setPhone] = useState<string>(employee?.phoneNumber);
  const [address, setAddress] = useState<string>(employee?.address);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const updatePersonalInfo = api.employee.updatePersonalInfo.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Personal info updated successfully.");
    },
  });

  const handleSubmit = async () => {
    updatePersonalInfo.mutate({
      employeeId: query.id,
      name,
      email,
      address,
      phoneNumber: phone,
    });
  };

  return (
    <main
      onClick={() => showDropdown && setShowDropdown(false)}
      className="mx-auto flex w-4/5 flex-col items-center pt-20"
    >
      <div className="relative ml-auto flex">
        <Button
          className="ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600"
          variant={"link"}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </Button>
        {showDropdown && (
          <Dropdown
            employee={employee}
            setShowModal={setShowModal}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600">
        {" "}
        <Heading size={"sm"}>{employee?.name}</Heading>
      </div>

      <form onSubmit={handleSubmit} className="slide-in-bottom mt-12 w-2/6">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="phone">Phone</label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label htmlFor="address">Address</label>
        <Input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="mt-4 space-x-2">
          <Button title="Update information" className="w-40">
            Save changes {<Check className="ml-2" />}
          </Button>

          <Button
            type="button"
            title="Go back"
            className="w-40"
            variant={"outline"}
            onClick={() => router.push(`/employees/${employee?.id}`)}
          >
            Cancel {<X className="ml-2" />}
          </Button>
        </div>
      </form>
    </main>
  );
}
