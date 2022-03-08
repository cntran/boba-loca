import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import Banner from '../components/banner'
import Card from '../components/card'
import useTrackLocation from '../hooks/use-track-location'
import { fetchBobaStores } from '../lib/boba-stores'
import styles from '../styles/Home.module.css'
import { ACTION_TYPES, StoreContext } from '../store/store-context'

export async function getStaticProps(context) {
  const bobaStores = await fetchBobaStores()
  return {
    props: {
      bobaStores
    }
  }
}

export default function Home(props) {
  const { state, dispatch } = useContext(StoreContext)
  const { bobaStores, latLong } = state
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()
  
  const [, setBobaStoresError] = useState('')

  const handleOnBannerBtnClick = () => {
    handleTrackLocation()
  }

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
          try {
            const fetchedBobaStores = await fetch(`/api/getBobaStoresByLocation?latLong=${latLong}&limit=6`)
            const bobaStoresData = await fetchedBobaStores.json()
            dispatch({
              type: ACTION_TYPES.SET_BOBA_STORES,
              payload: {
                bobaStores: bobaStoresData
              }
            })
            setBobaStoresError("")

          } catch(error) {
            setBobaStoresError(error.message)
          }
      }
    }
    fetchData()
  }, [latLong, dispatch])

  return (
    <div className={styles.container}>
      <Head>
        <title>Boba Loca</title>
        <meta name="description" content="Searching nearby boba tea shops" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} 
                handleOnClick={handleOnBannerBtnClick} />

        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}

        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="Boba Loca" width={700} height={400} />
        </div>

        {bobaStores.length > 0 && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Stores near me</h2> 
              <div className={styles.cardLayout}>
                {mapBobaStores(bobaStores)}
              </div>
            </div>
          </>
        )}

        {props.bobaStores.length > 0 && (
          <>
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>San Francisco stores</h2> 
            <div className={styles.cardLayout}>
              {mapBobaStores(props.bobaStores)}
            </div>
          </div>
        </>
        )}
        
      </main>
     
    </div>
  )
}

function mapBobaStores(stores) {
  return stores.map(store => {
    return (
      <Card key={store.id}
            name={store.name} 
            href={`/boba-store/${store.id}`}
            imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
            className={styles.card}
      />
    )
  })
}
