import axios from 'axios'
import Dropdown from '../Dropdown.tsx'
import Label from '../../ui/Label.tsx'
import Input from '../../ui/Input.tsx'
import Button from '../../ui/Button.tsx'
import Heading from '../../ui/Heading.tsx'
import { Logout } from '../../../Auth.tsx'
import Container from '../../ui/Container.tsx'
import { useNavigate } from 'react-router-dom'
import { Check, MoreVertical, X } from 'lucide-react'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'

interface PersonalInfoProps {
	employee: {
		_id: string
		name: string
		email: string
		phone: string
		notes: string[]
		address: string
		sickDays: number | string
		shiftPreferences: string[]
		vacationDays: number | string
	}
	loading: boolean
	showDropdown: boolean
	setLoading: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	setShowDropdown: Dispatch<SetStateAction<boolean>>
	setMessage: Dispatch<SetStateAction<string | null>>
}

const PersonalInfo: FC<PersonalInfoProps> = ({
	employee,
	loading,
	setLoading,
	setMessage,
	setError,
	showDropdown,
	setShowDropdown,
}) => {
	const { _id } = employee
	const navigate = useNavigate()
	const [modal, setShowModal] = useState<boolean>(false)
	const [name, setName] = useState<string>(employee.name)
	const [email, setEmail] = useState<string>(employee.email)
	const [phone, setPhone] = useState<string>(employee.phone)
	const [address, setAddress] = useState<string>(employee.address)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const { data } = await axios.put(
				`${import.meta.env.VITE_BASE_URL}/employees/${_id}`,
				{
					id: _id,
					name: name,
					email: email,
					phone: phone,
					address: address,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setMessage(data.message)
			setTimeout(() => {
				navigate(`/employees/${_id}`)
			}, 1000)
		} catch (error: any) {
			setError(error.response.data.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container
			size={'lg'}
			className='pt-20'>
			<div className='relative ml-auto flex'>
				<Button
					className='ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600'
					variant={'link'}
					onClick={() => setShowDropdown(!showDropdown)}>
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
			<div className='flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600'>
				{' '}
				<Heading size={'sm'}>{employee.name}</Heading>
			</div>

			<form
				onSubmit={handleSubmit}
				className='slide-in-bottom mt-12 w-2/6'>
				<Label htmlFor='name'>Name</Label>
				<Input
					size='lg'
					id='name'
					type='text'
					name='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Label htmlFor='email'>Email</Label>
				<Input
					size='lg'
					id='email'
					type='text'
					name='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Label htmlFor='phone'>Phone</Label>
				<Input
					size='lg'
					type='text'
					id='phone'
					name='phone'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
				/>
				<Label htmlFor='address'>Address</Label>
				<Input
					size='lg'
					type='text'
					id='address'
					name='address'
					value={address}
					onChange={(e) => setAddress(e.target.value)}
				/>
				<div className='space-x-2'>
					<Button
						loading={loading}
						title='Update information'
						className='w-40'>
						Save changes {<Check className='ml-2' />}
					</Button>

					<Button
						type='button'
						title='Go back'
						className='w-40'
						variant={'outline'}
						onClick={() => navigate(`/employees/${employee._id}`)}>
						Cancel {<X className='ml-2' />}
					</Button>
				</div>
			</form>
		</Container>
	)
}

export default PersonalInfo
