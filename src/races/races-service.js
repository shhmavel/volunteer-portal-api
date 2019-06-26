const RacesService = {
    getAllRaces(db){
        return db
            .from('races')
            .select('*')
    },
    serializeRace(race) {
        return {
            id: race.id,
            name: race.name,
        }
    }
}

module.exports = RacesService