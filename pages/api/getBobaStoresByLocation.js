import { fetchBobaStores } from "../../lib/boba-stores"

const getBobaStoresByLocation = async (req, res) => {

    try {
        const { latLong, limit } = req.query
        const response = await fetchBobaStores(latLong, limit)
        res.status(200)
        res.json(response)
    } catch (err) {
        res.status(500)
        res.json({ message: 'Oh no! Something went wrong.', err })
    }

}

export default getBobaStoresByLocation