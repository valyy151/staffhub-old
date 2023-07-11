import axios from 'axios'
import Modal from '../../ui/Modal.tsx'
import Input from '../../ui/Input.tsx'
import Button from '../../ui/Button.tsx'
import { Logout } from '../../../Auth.tsx'
import Paragraph from '../../ui/Paragraph.tsx'
import { Check, XCircle, Trash2, Pencil } from 'lucide-react'
import { FC, useState, SetStateAction, Dispatch } from 'react'

interface ShiftPreferenceProps {
	index: number
	loading: boolean
	employee: Employee
	shiftPreference: string
	setLoading: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	setMessage: Dispatch<SetStateAction<string | null>>
}

interface Employee {
	_id: string
	notes: string[]
}

const ShiftPreference: FC<ShiftPreferenceProps> = ({
	shiftPreference: sf,
	index,
	employee,
	loading,
	setError,
	setLoading,
	setMessage,
}) => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const [shiftPreference, setShiftPreference] = useState<string>(sf)
	const [editShiftPreference, setEditShiftPreference] = useState<boolean>(false)
	const [shiftPreferenceIndex, setShiftPreferenceIndex] = useState<number | null>(null)

	const deleteShiftPreference = async (index: number | null) => {
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const { data } = await axios.delete(
				`${import.meta.env.VITE_BASE_URL}/employees/preferences/?employeeId=${employee?._id}&index=${index}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setMessage(data.message)
		} catch (error: any) {
			setError(error.response.data.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
			setShowModal(false)
		}
	}

	const updateShiftPreference = async (index: number | null, shiftPreference: string) => {
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const { data } = await axios.put(
				`${import.meta.env.VITE_BASE_URL}/employees/preferences`,
				{
					shiftPreference: shiftPreference,
					index: index,
					employeeId: employee?._id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setError('')
			setLoading(false)
			setEditShiftPreference(false)
			setShowModal(false)
			setMessage(data.message)
		} catch (error: any) {
			setMessage('')
			setLoading(false)
			setShowModal(false)
			setError(error.response.data.message)
		}
	}

	return (
		<div className='mx-auto my-2 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700'>
			{editShiftPreference ? (
				<>
					<Input
						type='text'
						value={shiftPreference}
						className='m-0 w-[36rem] text-xl shadow-none focus:ring-0'
						onChange={(e) => setShiftPreference(e.target.value)}
					/>
					<Button
						size={'sm'}
						variant={'link'}
						title='Save changes'
						className='w-16 min-w-0'
						onClick={() => {
							setShiftPreferenceIndex(index)
							updateShiftPreference(index, shiftPreference)
						}}>
						{<Check />}
					</Button>
					<Button
						size={'sm'}
						title='Cancel'
						variant={'link'}
						className='w-16 min-w-0'
						onClick={() => setEditShiftPreference(false)}>
						{<XCircle />}
					</Button>
				</>
			) : (
				<div className='flex items-center'>
					<Paragraph
						size={'lg'}
						key={employee?._id}
						className='w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700'>
						{shiftPreference}
					</Paragraph>
					<Button
						size={'sm'}
						variant={'link'}
						className='w-16 min-w-0 rounded-full p-5 hover:bg-slate-100'
						onClick={() => {
							setEditShiftPreference(true)
							setShiftPreferenceIndex(index)
						}}
						title='Edit shift preference'>
						{<Pencil />}
					</Button>
					<Button
						size={'sm'}
						variant={'link'}
						className='w-16 min-w-0 rounded-full p-5 hover:bg-slate-100'
						onClick={() => {
							setShowModal(true)
							setShiftPreferenceIndex(index)
						}}
						title='Delete shift preference'>
						{<Trash2 />}
					</Button>

					{showModal && (
						<Modal
							loading={loading}
							text={'Delete shift preference?'}
							showModal={showModal}
							cancel={() => setShowModal(false)}
							submit={() => deleteShiftPreference(shiftPreferenceIndex)}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export default ShiftPreference
