import React from 'react'
import Common from '../common'
class CallType extends React.Component{
    render(){
        return (
            <Common 
                func="来电类别"
                getPage="/complaintIncomingCallType/getPage"
                insert="/complaintIncomingCallType/insert"
                update="/complaintIncomingCallType/update"
                delete="/complaintIncomingCallType/delete"
            />
        )
    }
}

export default CallType