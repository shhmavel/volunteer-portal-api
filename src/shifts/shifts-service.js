const xss = require('xss')

const ShiftsService = {
    getAllShifts(db){
        return db
            .from('shifts')
            .select('*')
    },
    getById(db, id){
        return ShiftsService.getAllShifts(db)
            .where('shift.id', id)
            .first()
    },
    insertShift(db, newShift){
        return db
            .insert(newShift)
            .into('shifts')
            .returning('*')
            .then(([shift]) => shift)
    },
    serializeShift(shift) {
        return {
          id: shift.id,
          name: shift.name,
          race_id: shift.race_id,
          date: shift.date,
          day: shift.day,
/*           user: {
              id: user.id,
              full_name: user.full_name,
              email: user.email
          }, */
        }
    }
}

module.exports = ShiftsService