var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var orderSchema = new Schema({
    fromAddress: String,
    fromLoc: {
        lat: Number,
        lon: Number
    },
    roadAddresses: [],
    distance: Number,
    price: Number,
    isChildren: Boolean,
    inBaggaje: Boolean,
    isAnimal: Boolean,
    isGory: Boolean,
    message: String,
    choosenMoneyType: String,
    choosenTarif: Number,
    isTimeNow: Boolean,
    dateTime: Date,
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: String
    //driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true }
}, {
    timestamps: true
});

orderSchema.plugin(mongoosePaginate);

mongoose.model('Order', orderSchema);
