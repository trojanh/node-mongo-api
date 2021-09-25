import { Records } from '../models/index.js'

/**
 * fetches documents from records collection with the specified query logic
 * @param {any} request
 * @param {any} response
 * @returns {any}
 */
export async function fetchRecords(request, response) {
  try {
    const { startDate, endDate, minCount, maxCount } = request.body
    const records = await Records.aggregate([
      {
        $addFields: {
          totalCount: { $sum: '$counts' }
        }
      },
      {
        $match: {
          totalCount: {
            // convert string to number
            $gte: +minCount,
            $lte: +maxCount
          },
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $project: {
          key: 1,
          totalCount: 1,
          createdAt: 1
        }
      }
    ])

    return response.status(200).json({
      code: 0,
      msg: 'Success',
      records
    })
  } catch (error) {
    return response.status(500).json({
      code: 1,
      msg: 'Failure',
      error: error
    })
  }
}
