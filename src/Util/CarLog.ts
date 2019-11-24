class CarLog {

    static getLocationAndDateInfo = () => {
        return {
            pickupCityId: '',
            pickupCityName: '',
            pickupLocationCode: '',
            pickupLocationType: '',
            pickupLocationName: '',
            pickupDateTime: '',
            dropOffCityId: '',
            dropOffCityName: '',
            dropOffLocationCode: '',
            dropOffLocationType: '',
            dropOffLocationName: '',
            dropOffDateTime: '',
            isOneWay: '',
            isSendCar: '2',
            isPickupCar: '2'
        };
    }

    static logBasicInfo = async () => {
        return {
            clientType: '',
            businessType: '',
            distibutionChannelId: '',
            channelId: '',
            sId: '',
            allianceId: '',
            visitortraceId: '',
            sourceId: '',
            vid: '',
            pvid: '',
            language: '',
            locale: '',
            site: '',
            currency: '',
            residency: '',
            countryCode: '',
            countryName: '',
            abVersion: '',
            partialVersion: '',
            crnVersion: '',
            uId: '',
            telephone: '',
            currentTime: '',
            beijingTime: '',
            create: '',
            age: '',
            defaultAge: '',
            ...CarLog.getLocationAndDateInfo()
        };
    }

    static LogCode = () => {

    }

    static LogTrace = () => {

    }

    static LogMetric = () => {

    } 
}

export default CarLog;