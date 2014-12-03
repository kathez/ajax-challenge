How many zip codes are in Washington State?

db.zips.find({state: 'WA'},{_id: 1})

How many zip codes are within the City of Seattle?

db.zips.find({city: 'SEATTLE'}, {_id: 1}).count()

List the zip codes in Cincinnati, Ohio. Restrict the output to the zip codes only

db.zips.find({city: 'CINCINNATI', state: 'OH'}, {_id: 1}).count()

According to this database, total population of all City of Seattle zip codes?

$match the city to SEATTLE and WA, 
$project city and state, and pop
$group sum pop 



db.zips.aggregate([
 { $match: {city: 'SEATTLE', state: 'WA'}},
 { $project: {state: 1, city: 1, pop: 1}},
 { $group:
 	{_id: {state: "$state", city: "$city"}, 
 	pop: { $sum: "$pop"}}
 }
])

List the zip codes with populations of less than or equal to 1,000. Exclude the latitude and longitude from the output.
$match the populations that are $lte to 1000
$project loc: 0
db.zips.aggregate([
 {$match: {
  pop: { $lte: 1000}
  }},
 {$project: {
  _id: 1,
  city: 1,
  pop: 1,
  state: 1
 }}
])

db.zips.aggregate([
 {$match: {
  pop: { $lte: 1000}
  }},
 {$project: { _id: 1}},
 {$group: {_id:"numTotal: { $sum: 1}}
 }
]) 

db.zips.find({pop: {$gt: 0}}, {city: 1, pop: 1, state: 1}).sort({pop: 1}).limit(10)

List zip codes in the Kentucky with less than 50,000 people but more than 10,000 people. Exclude lat/long from the output. 

db.zips.find({pop: {$lt: 50000, $gt: 10000}, state: 'KY'}, {city: 1, state: 1, pop:1}) 


db.zips.aggregate([
 { $project: {city: 1, state: 1, pop: 1}},
 { $group:
 	{_id: {city: "$city", state: "$state"}, 
 	totalPop: { $sum: "$pop"}}
 },
 { $sort: {totalPop: 1}},
 { $limit: 5}
])

db.zips.aggregate([
 { $project: {_id: 1, state: 1}},
 { $group:
 	{_id: "$state", 
 	totalZips: { $sum: 1}}
 },
 { $sort: {totalZips: -1}}
])

db.zips.find( { loc: { $geoWithin: { $centerSphere: [ [ -74, 40.74 ] ,
                                                     100 / 3959 ] } } } )

db.zips.find({loc: {$geoWithin: { $centerSphere: [[ -122.302236, 47.663266 ], 50/3959]}}
})

db.zips.aggregate([
 {$match: {loc: {$geoWithin: { $centerSphere: [[ -122.302236, 47.663266 ], 50/3959]}}, city: 'SEATTLE'}},
 {$project: {city: 1, pop: 1}},
 {$group: 
 	{_id: "$city",
 	totalPops: {$sum: "$pop"}}}
])
