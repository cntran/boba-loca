// initialize unsplash
import { createApi } from "unsplash-js"

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
})

const getUrlForBobaStores = (latLong, 
                             query, 
                             limit) => {
    return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`
}

const getListofBobaStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'boba',
    perPage: 40
  })  

  const unsplashResults = photos.response.results
  return unsplashResults.map(result => result.urls['small'])

}

export const fetchBobaStores = async (latLong = '37.75475728601662,-122.42690410873773', 
                                      limit = 6) => {
  const apiEndpoint = getUrlForBobaStores(latLong, 'boba', limit)
  const photos = await getListofBobaStorePhotos()
  
  const response = await fetch(apiEndpoint, {
        "headers": {
          'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || ''
        }
      })
  const data = await response.json();
  return (
    data.results?.map((venue, idx) => {
      const neighborhood = venue.location.neighborhood;
      return {
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighborhood:
          (neighborhood && neighborhood.length > 0 && neighborhood[0]) ||
          venue.location.cross_street ||
          "",
        imgUrl: photos[idx],
      }
    }) || []
  )
}
