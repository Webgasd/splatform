import React from 'react'
import Common from '../common'
class MessageSource extends React.Component{
    render(){
        return (
            <Common 
                func="信息来源"
                getPage="/complaintInformationComeType/getPage"
                insert="/complaintInformationComeType/insert"
                update="/complaintInformationComeType/update"
                delete="/complaintInformationComeType/delete"

            />
        )
    }
}

export default MessageSource