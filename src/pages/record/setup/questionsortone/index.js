import React from 'react'
import Common from '../common'
class QuestionSortOne extends React.Component{
    render(){
        return (
            <Common
                func="问题分类（一类）"
                getPage="/complaintProblemTypeOne/getPage"
                insert="/complaintProblemTypeOne/insert"
                update="/complaintProblemTypeOne/update"
                delete="/complaintProblemTypeOne/delete"
            />
        )
    }
}

export default QuestionSortOne