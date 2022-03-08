import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../../styles/boba-store.module.css"
import cls from "classnames"
import Image from "next/image"
import { fetchBobaStores } from "../../lib/boba-stores"
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../store/store-context"
import { fetcher, isEmpty } from "../../utils"
import useSWR from "swr"

export async function getStaticProps(staticProps) {
    const params = staticProps.params
    const bobaStores = await fetchBobaStores()
    const findBobaStoreById = bobaStores.find(bobaStore => {
        return bobaStore.id.toString() === params.id
    })

    return {
        props: {
            bobaStore: findBobaStoreById ? findBobaStoreById : {}
        }
    }
}

export async function getStaticPaths() {
    const bobaStores = await fetchBobaStores()
    const paths = bobaStores.map(bobaStore => {
       return { params: { id: bobaStore.id.toString() } }
    })
    return {
        paths,
        fallback: true
    }
}

const BobaStore = (initialProps) => {
    const router = useRouter()
    const id = router.query.id

    const [bobaStore, setBobaStore] = useState(initialProps.bobaStore || {})
    const { state: { bobaStores } } = useContext(StoreContext)

    const handleCreateBobaStore = async (bobaStoreObj) => {
        try {
            const { id, name, imgUrl, neighborhood, address } = bobaStoreObj
            const response = await fetch('/api/createBobaStore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id, 
                    name, 
                    voting: 0, 
                    imgUrl, 
                    neighborhood: neighborhood || '', 
                    address: address || ''
                })
            })
            await response.json()
        } catch (err) {
            console.log('Error creating boba store', err)
        }
    }

    useEffect(() => {
        if (isEmpty(initialProps.bobaStore)) {
            if (bobaStores.length > 0) {
                const bobaStoreFromContext = bobaStores.find((store) => {
                    return store.id.toString() === id
                })
                if (bobaStoreFromContext) {
                    setBobaStore(bobaStoreFromContext)
                    handleCreateBobaStore(bobaStoreFromContext)
                }
            }
        } else {
            handleCreateBobaStore(initialProps.bobaStore)
        }
    }, [id, initialProps, initialProps.bobaStore, bobaStores])

    const {
        address = "",
        name = "",
        neighborhood = "",
        imgUrl = "",
      } = bobaStore
    const [votingCount, setVotingCount] = useState(0)
    const { data, error } = useSWR(`/api/getBobaStoreById?id=${id}`, fetcher)

    useEffect(() => {
        if (data && data.length > 0) {
            setBobaStore(data[0])
            setVotingCount(data[0].voting)
        }
    }, [data])

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const handleUpvoteButton = async () => {
        try {
            const response = await fetch("/api/favoriteBobaStoreById", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
              }),
            });
      
            const dbBobaStore = await response.json();
      
            if (dbBobaStore && dbBobaStore.length > 0) {
              let count = votingCount + 1;
              setVotingCount(count);
            }
        } catch (err) {
            console.error("Error upvoting the boba store", err);
        }


    }

    if (error) {
        return <div>Something went wrong retrieving boba store page</div>
    }

    return (
        <div className={cls(styles.layout)}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a>← Back to home</a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                    <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} width={600} height={360} className={styles.storeImg} alt={name}></Image>
                </div>
                <div className={cls(styles.col2, 'glass')}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" width="24" height="24" alt="places" />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {neighborhood && (
                        <div className={styles.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="neighborhood" />
                        <p className={styles.text}>{neighborhood}</p>
                        </div>
                    )}
                    
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24" alt="stars" />
                        <p className={styles.text}>{votingCount}</p>
                    </div>

                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
                </div>
            </div>
        </div>
    )   
}

export default BobaStore