const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY || ''})
                .base(process.env.AIRTABLE_BASE_KEY || '');


export const airtable = base("boba-stores")

const getMinifiedRecord = (record) => {
    return {
        recordId: record.id,
        ...record.fields
    }
}

export const getMinifiedRecords = (records) => {
    return records.map(record => getMinifiedRecord(record))
}

export const findRecordByFilter = async (id) => {
    const findBobaStoreRecords = await airtable.select({
        filterByFormula: `id="${id}"`
    }).firstPage()

    if (findBobaStoreRecords.length > 0) {
        return getMinifiedRecords(findBobaStoreRecords)
    }

    return []
}
