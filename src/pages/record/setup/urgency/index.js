import React from 'react'
import Common from '../common'
class Urgency extends React.Component{
    render(){
        return (
            <Common
                func="紧急程度"
                getPage="/complaintEmergencyType/getPage"
                insert="/complaintEmergencyType/insert"
                update="/complaintEmergencyType/update"
                delete="/complaintEmergencyType/delete"
            />
        )
    }
}

export default Urgency