import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { dummyDashboardData } from '../../assets/assets';
import BlurCircle from '../../components/BlurCircle'
import Title from '../../components/admin/Title';

const Dashboard = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  })
  const [loading, setLoading] = useState(true);

  const dashboardCards=[
    { title: 'Total Bookings', value: dashboardData.totalBookings || '0', icon: ChartLineIcon },
    { title: 'Total Revenue', value: currency + dashboardData.totalRevenue || '0', icon: CircleDollarSignIcon },
    { title: 'Active Shows', value: dashboardData.activeShows.length  || '0', icon: PlayCircleIcon },
    { title: 'Total Users', value: dashboardData.totalUser || '0', icon: UserIcon }
  ]

  const fetchDashboardData = async() => {
    setDashboardData(dummyDashboardData)
    setLoading(false)
  }

  useEffect(()=> {
    fetchDashboardData();
  },[])

  return !loading ? (
    <>
    <Title text1='Admin' text2='Dashboard' />
    <div>
      <BlurCircle top='-100px' left='0' />
      <div className='flex  flex-wrap gap-4 w-full'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border-primary/20 rounded-md max-w-50 w-full' >
            <div>
              <h1 className='text-sm'>
                {card.title}
              </h1>
              <p className='text-xl font-medium mt-1'>
                {card.value}
              </p>
            </div>
            <card.icon className='w-6 h-6'/>
          </div>
        ))}
      </div>
    </div>
    <p className='mt-10 text-lg font-medium'>
      Active Shows
    </p>
    <div>
      <BlurCircle top='100px' lef='-10px'/>

      {dashboardData.activeShows.map((show) => (
        <div>
          <img src={show.movie.poster_path} alt="" className='h-60 w-full object-cover' />
          <p>{show.movie.title}</p>
          <div>
            <p>{currency} {show.showPrice}</p>
            <p></p>
          </div>
        </div>
      ))}

    </div>
    </>
  ) :
  <Loading/>
}

export default Dashboard