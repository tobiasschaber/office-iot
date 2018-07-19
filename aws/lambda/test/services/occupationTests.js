const occupationService = require('../../src/services/occupation');


it('should show all occupations for all rooms', function(done) {

    occupationService.getAllRoomOccupations(function(result) {
        if(!result) {
            done("No motions returned")
        }

        console.log(result.items[0].roomId)
        console.log(result.items[0].motions)

        done(false);

    });
});