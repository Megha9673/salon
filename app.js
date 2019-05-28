const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Order = require('./models/order')
const User = require('./models/user')
const mongoose = require('mongoose');
let arr = []
// connect to mongodb
mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/order_info',(req,res)=>{
    Order.aggregate(
        [
            {
                $group : {
                    _id: "$user_id",
                    averageBillValue: { $avg: "$subtotal" },
                    count: { $sum: 1 }
                },
            },
            {    
                $lookup:
                    {
                        from: "User",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "name"
                    },
            },
            {       
                $project:{
                    "_id":1,
                    "averageBillValue":1,
                    "count": 1,
                    "name.name":1,
                    "name._id":1
                }    
            }
        ],(err,data)=>{
            if(err){
                console.log(err)
                res.json({
                    error:1,message:'Error occured'
                })
            }else{
                arr[0]=0
                data.forEach(element => {
                    arr[element._id]=element.count
                });
                console.log(arr)
             
                res.json({success:1,data:data})
            }
        }
    )
})

app.get('/update',(req,res)=>{
    User.find({},(err,rows)=>{
        if(err){
            console.log(err)
            res.json({success:false,message:'Error occured'})
        }else{
            console.log(arr)
            rows.forEach(element=>{
                console.log(element.user_id)
                element.noOfOrders=arr[element.user_id]
                element.save()
            })
            console.log(rows)
            res.json({success:true,message:'Successfully updated'})
        }
        
    })
})

app.listen('3000')
