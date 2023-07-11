import axios from 'axios'
import Input from '../../ui/Input.tsx'
import Dropdown from '../Dropdown.tsx'
import Button from '../../ui/Button.tsx'
import Heading from '../../ui/Heading.tsx'
import { Logout } from '../../../Auth.tsx'
import Container from '../../ui/Container.tsx'
import ShiftPreference from './ShiftPreference.tsx'
import { Check, MoreVertical, Sticker, X } from 'lucide-react'
import { Dispatch, FC, SetStateAction, useState } from 'react'

interface ShiftPreferencesListProps {
	employee: {
		_id: string
		name: string
		email: string
		phone: string
		notes: string[]
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

const ShiftPreferencesList: FC<ShiftPreferencesListProps> = ({
	employee,
	loading,
	setError,
	setLoading,
	setMessage,
	showDropdown,
	setShowDropdown,
}) => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const [shiftPreference, setShiftPreference] = useState<string>('')
	const [showAddShiftPreference, setShowAddShiftPreference] = useState<boolean>(false)

	const addShiftPreference = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const token = localStorage.getItem('token')
			const { data } = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/employees/preferences`,
				{
					shiftPreference: shiftPreference,
					employeeId: employee._id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setShiftPreference('')
			setMessage(data.message)
		} catch (error: any) {
			setError(error.response.data.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
			setShowAddShiftPreference(false)
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
				<Heading size={'sm'}>Shift preferences for {employee.name}</Heading>
				{showAddShiftPreference ? (
					<Button
						size={'sm'}
						className='w-48 min-w-0'
						onClick={() => setShowAddShiftPreference(false)}
						variant={'outline'}>
						Cancel
						<X className='ml-2 h-5 w-5' />
					</Button>
				) : (
					<Button
						size={'sm'}
						className='w-48'
						onClick={() => setShowAddShiftPreference(true)}>
						New Shift Preference
						<Sticker className='ml-2 h-5 w-5' />
					</Button>
				)}
			</div>

			{!showAddShiftPreference && (
				<div className='slide-in-bottom mt-32'>
					{employee.shiftPreferences.length > 0 && (
						<Heading
							size={'xs'}
							className='mb-3 text-center'>
							{employee.shiftPreferences.length}{' '}
							{employee.shiftPreferences.length === 1 ? 'shift preference' : 'shift preferences'}
						</Heading>
					)}
					{employee.shiftPreferences.length > 0 ? (
						employee.shiftPreferences.map((shiftPreference, index) => (
							<ShiftPreference
								key={index}
								index={index}
								loading={loading}
								employee={employee}
								setError={setError}
								setMessage={setMessage}
								setLoading={setLoading}
								shiftPreference={shiftPreference}
							/>
						))
					) : (
						<>
							{!showAddShiftPreference && (
								<Heading
									className='font-normal'
									size={'xs'}>
									There are no shift preferences for this employee.
								</Heading>
							)}
						</>
					)}
				</div>
			)}
			{showAddShiftPreference && (
				<form
					onSubmit={addShiftPreference}
					className='slide-in-bottom mt-32 flex flex-col space-x-4'>
					<Heading
						size={'xs'}
						className='mb-3 text-center'>
						New shift preference
					</Heading>
					<div className=' flex w-[48rem]'>
						<Input
							type='text'
							value={shiftPreference}
							size={'lg'}
							placeholder=' Add a shift preference...'
							onChange={(e) => setShiftPreference(e.target.value)}
						/>
						<Button
							title='Add shift preference'
							variant={'link'}
							className='w-20 min-w-0'>
							<Check
								size={36}
								className='mt-2'
							/>
						</Button>
					</div>
				</form>
			)}
		</Container>
	)
}

export default ShiftPreferencesList
