import React, {FormEvent, useState} from 'react'
import {Button} from '../../components/core'
import {useMultistepForm} from '../../hooks/useMultiStepForm'
import {AddressForm, HotelInfoForm, ImagesForm, PublishedForm, TypeForm} from '../../components/join'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {useCreateHotelMutation} from '../../services/userApi'
import {useAppDispatch} from '../../store/hooks'
import {addToMyHotels} from '../../features/hotelSlice'
import {IHotel} from '../../models/IHotel'

const Create = () => {
    const INITIAL_DATA: IHotel = {
        title: '',
        type: '',
        desc: '',
        descShort: '',
        city: '',
        address: {
            name: ''
        },
        distance: '',
        photos: [],
        featured: false,
        name: '',
        published: false
    }
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [data, setData] = useState(INITIAL_DATA)

    function updateFields (fields: Partial<IHotel>) {
        setData(prev => {
            return {...prev, ...fields}
        })
    }

    const {steps, currentStepIndex, step, isFirstStep, isLastStep, back, next} =
        useMultistepForm([
            <TypeForm key={0} {...data} updateFields={updateFields}/>,
            <HotelInfoForm key={1} {...data} updateFields={updateFields}/>,
            <AddressForm key={2} {...data} updateFields={updateFields}/>,
            <ImagesForm key={3}{...data} updateFields={updateFields}/>,
            <PublishedForm key={4} {...data} updateFields={updateFields}/>
        ])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isLastStep) return next()
        try {
            const result = await createHotel(data).unwrap()
            dispatch(addToMyHotels(result))
            await router.push('/join')
            toast.success('Create to success')
        } catch (e) {
            console.log(e)
            toast.error('Something went wrong')
        }
    }

    const [createHotel, {isLoading: isCreating}] = useCreateHotelMutation()

    return (
        <div
            className="mx-auto container px-4 lg:px-6 py-6 relative"
        >
            <form onSubmit={onSubmit}>
                <div
                    className="absolute top-0 right-0"
                >
                    {currentStepIndex + 1} / {steps.length}
                </div>
                {step}
                <div
                    className="mt-2.5 flex justify-end gap-2.5"

                >
                    {!isFirstStep && (
                        <div onClick={back}>
                            <Button text="Back" textColor="text-white" bgColor="bg-primary"/>
                        </div>
                    )}
                    <button
                        type="submit" disabled={isCreating}>
                        <Button text={isLastStep ? 'Submit' : 'Next'} textColor="text-white" bgColor="bg-primary"/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Create