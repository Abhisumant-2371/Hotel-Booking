import React, {useEffect, useState} from 'react'
import Types from './Types'
import Hotels from './Hotels'
import {useAppDispatch} from '../../store/hooks'
import {useFetchAllHotelsQuery} from '../../services/hotelApi'
import {setHotels} from '../../features/hotelSlice'

const HotelType = () => {
    const dispatch = useAppDispatch()
    const {data: hotels, isLoading, isSuccess, isError, error} = useFetchAllHotelsQuery()
    const [type, setType] = useState('all')
    useEffect(() => {
        if (isSuccess) {
            dispatch(
                setHotels({hotels})
            )
        }
    }, [dispatch, hotels, isSuccess])

    if (isLoading) {
        return <div>Loading</div>
    }
    return (
        <div className="flex flex-col gap-y-5">
            <div>
                <h1 className="font-bold text-2xl text-black">Quick and easy hotel planer</h1>
                <h2 className="text-primary font-light text-xl">Pick a vibe and explore the top destinations in
                    Vietnam</h2>
            </div>
            <Types type={type} setType={setType}/>
            <div className="mb-5">
                <Hotels type={type}/>
            </div>
        </div>
    )
}

export default HotelType