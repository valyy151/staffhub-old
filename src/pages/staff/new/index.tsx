import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import { type GetServerSideProps } from "next/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function InputWithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}

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
        <Heading size={"sm"} className="mb-4">
          Create an Employee
        </Heading>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of your employee"
        />
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of your employee"
        />

        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={address}
          placeholder="Enter the address of your employee"
          onChange={(e) => setAddress(e.target.value)}
        />

        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={phoneNumber}
          placeholder="Enter the phone number of your employee"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Button title="Update information" className="mt-2">
          Save changes {<Save className="ml-2" />}
        </Button>
      </form>
    </div>
  );
}
