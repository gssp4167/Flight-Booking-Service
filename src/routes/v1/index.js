const express=require('express');
const router=express.Router();
const {InfoController}=require('../../controllers');

// console.log("Inside v1Routes");

router.get('/info',    InfoController.info);

module.exports=router;