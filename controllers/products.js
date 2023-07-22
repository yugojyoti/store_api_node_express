const ProductModel=require('../models/product.js')

const getAllProductsStatic=async (req,res)=>{
    const products=await ProductModel.find({})
res.status(200).json({products,nbHits:products.length})
}

const getAllProducts=async(req,res)=>{
    console.log(req.query)
    const {featured,company,name,sort,fields,numericFilters}=req.query
    const queryObject={}
    if(featured){
        queryObject.featured=featured==='true'?true:false
    }
    if(company){
        queryObject.company=company
    }
   

    if(name){
        queryObject.name={$regex:name, $options:'i'}
    }
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$e',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g
        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        const options=['price','rating']
        filters=filters.split(',').forEach((item)=>{
            const [field,operator,value]=item.split('-')

            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
            }
        })

    }
    let result= ProductModel.find(queryObject)
    
    if(sort){
        const sortList=sort.split(',').join(' ')
        console.log(sortList)
        result=result.sort(sortList)
    }else{
        result=result.sort('createdAt')
    }
    if (fields){
        const fieldList=fields.split(',').join(' ')
        result=result.select(fields)
    }
    const page=Number(req.query.page)||1
    const limit=Number(req.query.limit)||10 
    const skip=(page-1)*limit
    result=result.skip(skip).limit(limit)


     const products=await result
  
    res.status(200).json({products,nbHits:products.length})
}

module.exports={getAllProductsStatic,getAllProducts}