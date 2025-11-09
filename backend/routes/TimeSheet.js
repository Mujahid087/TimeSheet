const express=require("express") 
const router=express.Router(); 
const protect=require("../middlewares/protect")
const admin=require("../middlewares/admin")
const {createTimeSheet, rateTimeSheet, findMyTimesheets, getMyTimeSheets, getTimeSheet, getEmployeesTimesheets}=require("../controllers/timesheet") 
const manager=require("../middlewares/manager")
const validateId=require('../middlewares/validateId')


router.post('/timesheet', protect, admin, createTimeSheet);
router.get('/employees-timesheets', protect, manager, getEmployeesTimesheets
);
router.get('/timesheet/:id', validateId('id'), protect, getTimeSheet);
router
  .route('/timesheets')
  .get(protect, getMyTimeSheets)
  .post(protect, findMyTimesheets);
router.post(
  '/rate-timesheet/:id',
  validateId('id'),
  protect,
  manager,
rateTimeSheet
);

module.exports = router;

module.exports=router