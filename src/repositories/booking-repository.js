const {StatusCodes}=require('http-status-codes');
const {Booking}=require('../models');
const {Op}=require('sequelize');
const CrudRepository=require('./crud-repository');
const {Enums}=require('../utils/common');
const {BOOKED,CANCELLED,INITIATED,PENDING}=Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data,transaction){
        const response=await Booking.create(data,{transaction:transaction});
        return response;
    }

    async get(data,transaction){
        const response=await this.model.findByPk(data,{transaction:transaction});
        if(!response){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id,data,transaction){//data is an object containing col,val
        try {
            const response=await this.model.update(data,{
                where:{
                    id:id
                }
            },{transaction:transaction});
            return response;
        } catch (error) {
            Logger.error('Something went wrong in the CRUD Repo: destroy');
            throw error;
        }
    }

    async cancelOldBookings(timeStamp){
        const response=await Booking.update({status:CANCELLED},{
            where:{
                [Op.and]:[
                {
                    createdAt:{
                        [Op.lt]:timeStamp
                    }
                },
                {
                    status:{
                        [Op.ne]:BOOKED
                    }
                },
                {
                    status:{
                        [Op.ne]:CANCELLED
                    }
                }
                ]
            }
        });
        return response;
    }
}

module.exports=BookingRepository;
