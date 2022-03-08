import { airtable, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable"

const createBobaStore = async (req, res) => {

    try {

        if (req.method === "POST") {
            const { id, name, neighborhood, address, imgUrl, voting } = req.body
            
            const records = await findRecordByFilter(id)
    
            if (records.length > 0) {
                res.status(200)
                res.json(records)
            } else {
                //  create record
                if (id && name) {
                    const createRecords = await airtable.create([
                        {
                            fields: {
                                id,
                                name,
                                address,
                                neighborhood,
                                voting,
                                imgUrl
                            }
                        }
                    ])
                

                    res.status(200)
                    res.json(getMinifiedRecords(createRecords))
                } else {
                    res.status(422)
                    res.json({message: "id and name are required."})
                }
            }
        } else {
            res.status(405)
            res.json( {message: "unsupported method" })
        }      

    } catch (err) {
        res.status(500)
        res.json({ message: 'Oh no! Something went wrong.', err })
    }

}

export default createBobaStore