const xss = require('xss')

const ShiftsService = {
    getAllShifts(db, user_id, race_id){
        return db
            .from('shifts AS sht')
            .select(
                'sht.id',
                'sht.name',
                'sht.race_id',
                'sht.date',
                'sht.day',
                'sht.time',
                'rc.name AS raceName',
                'sht.user_id',
            )
            .modify(function(queryBuilder) {
                if(user_id){
                    queryBuilder.where('user_id',user_id)
                }
                if(race_id){
                    queryBuilder.where('race_id',race_id)
                        .andWhere('user_id',null)
                }
            })
                .join(
                    'races AS rc',
                    'rc.id',
                    'sht.race_id'
                )
    },
    getById(db, id){
        return ShiftsService.getAllShifts(db)
            .where('shift.id', id)
            .first()
    },
    updateShift(knex, id, newFields){
    return knex('shifts')
        .where({ id })
        .update(newFields)
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
          time: shift.time,
          raceName: shift.raceName,
        }
    },
    getShiftsForRace(db, race_id){
        return db
            .from('shifts AS sht')
            .select(
                'sht.id',
                'sht.name',
                'sht.race_id',
                'sht.date',
                'sht.day',
                'sht.time',
                'rc.name AS raceName',
            )
            .where('sht.race_id', race_id)
            .join(
                'races AS rc',
                'rc.id',
                'sht.race_id'
            )
    }
}

module.exports = ShiftsService