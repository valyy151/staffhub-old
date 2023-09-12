import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import Input from "~/components/ui/Input";
import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { type GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function NewEmployeePage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !address || !phoneNumber) {
      return toast("Please fill out all the fields.");
    }

    createEmployee.mutate({ name, email, address, phoneNumber });
  }

  const createEmployee = api.employee.create.useMutation({
    onSuccess: () => {
      window.location.href = "/staff";
    },

    onError: () => {
      toast.error("There was an error creating the employee.");
    },
  });

  return (
    <div className="px-2">
      <form onSubmit={handleSubmit} className="mx-auto mt-12 w-[23rem]">
        <Heading className="mb-4">Create an Employee</Heading>
        <label className="text-xl" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          type="text"
          name="name"
          value={name}
          className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of your employee"
        />
        <label className="text-xl" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="text"
          name="email"
          value={email}
          className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of your employee"
        />

        <label className="text-xl" htmlFor="address">
          Address
        </label>
        <Input
          type="text"
          id="address"
          name="address"
          value={address}
          className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          placeholder="Enter the address of your employee"
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="text-xl" htmlFor="phone">
          Phone
        </label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={phoneNumber}
          className="mb-2 h-16 bg-white text-xl dark:bg-transparent"
          placeholder="Enter the phone number of your employee"
          onChange={(e) => setPhoneNumber(e.target.value)}
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
  );
}
