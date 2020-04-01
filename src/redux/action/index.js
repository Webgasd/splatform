export const type = {
    ADD_TABS:'ADD_TABS',
    CHANGE_TABS:'CHANGE_TABS',
    ADD_DATA_ACL:'ADD_DATA_ACL',
    REFRESH_USER:'REFRESH_USER',
    CHANGE_WASTE:'CHANGE_WASTE',
    CLEAR_WASTE:'CLEAR_WASTE',
    CHANGE_MATERIAL:'CHANGE_MATERIAL',
    CLEAR_MATERIAL:'CLEAR_MATERIAL',
    CHANGE_LEDGER:'CHANGE_LEDGER',
    CLEAR_LEDGER:'CLEAR_LEDGER',
    CHANGE_ADDITIVE:'CHANGE_ADDITIVE',
    CLEAR_ADDITIVE:'CLEAR_ADDITIVE',
    CHANGE_QUICKCHECK:'CHANGE_QUICKCHECK',
    CLEAR_QUICKCHECK:'CLEAR_QUICKCHECK',
    CHANGE_GOVQUICK:'CHANGE_GOVQUICK',
    CLEAR_GOVQUICK:'CLEAR_GOVQUICK',
    CHANGE_CQUICK:'CHANGE_CQUICK',
    CLEAR_CQUICK:'CLEAR_CQUICK',
    CHANGE_GQUICK:'CHANGE_GQUICK',
    CLEAR_GQUICK:'CLEAR_GQUICK',
    CHANGE_PARCHIVE:'CHANGE_PARCHIVE',
    CHANGE_SMALLCATERING:'CHANGE_SMALLCATERING',
    CHANGE_INPUT_VALUE:'CHANGE_INPUT_VALUE',
    CHANGE_SELECT_VALUE:'CHANGE_SELECT_VALUE',
    CLEAR_INPUT:'CLEAR_INPUT',
    CHANGE_PARCHIVE_INPUT:'CHANGE_PARCHIVE_INPUT',
    CHANGE_GOVERNMENT:'CHANGE_GOVERNMENT',
    CLEAR_GOVERNMENT:'CLEAR_GOVERNMENT',
    CHANGE_GOVERNMENT_INPUT:'CHANGE_GOVERNMENT_INPUT',
    CHANGE_GOVERNMENT_SELECT:'CHANGE_GOVERNMENT_SELECT',
    CHANGE_ENTERPRISE:'CHANGE_ENTERPRISE',
    CLEAR_ENTERPRISE:'CLEAR_ENTERPRISE',
    CHANGE_EMPLOYEE:'CHANGE_EMPLOYEE',
    CLEAR_EMPLOYEE:'CLEAR_EMPLOYEE',
    CHANGE_WASTE:'CHANGE_WASTE',
    CLEAR_WASTE:'CLEAR_WASTE',
    CHANGE_MATERIAL:'CHANGE_MATERIAL',
    CLEAR_MATERIAL:'CLEAR_MATERIAL',
    CHANGE_LEDGER:'CHANGE_LEDGER',
    CLEAR_LEDGER:'CLEAR_LEDGER',
    CHANGE_ADDITIVE:'CHANGE_ADDITIVE',
    CLEAR_ADDITIVE:'CLEAR_ADDITIVE',
    CHANGE_QUICKCHECK:'CHANGE_QUICKCHECK',
    CLEAR_QUICKCHECK:'CLEAR_QUICKCHECK',
    CHANGE_GOVQUICK:'CHANGE_GOVQUICK',
    CLEAR_GOVQUICK:'CLEAR_GOVQUICK',
    CHANGE_CQUICK:'CHANGE_CQUICK',
    CLEAR_CQUICK:'CLEAR_CQUICK',
    CHANGE_GQUICK:'CHANGE_GQUICK',
    CLEAR_GQUICK:'CLEAR_GQUICK',
    CHANGE_CLEANING:'CHANGE_CLEANING',
    CLEAR_CLEANING:'CLEAR_CLEANING',
    CHANGE_DISHES:'CHANGE_DISHES',
    CLEAR_DISHES:'CLEAR_DISHES',
    CHANGE_PARTY:'CHANGE_PARTY',
    CLEAR_PARTY:'CLEAR_PARTY',
    CHANGE_SIMPLE:'CHANGE_SIMPLE',
    CLEAR_SIMPLE:'CLEAR_SIMPLE',
    CHANGE_PURCHASE:'CHANGE_PURCHASE',
    CLEAR_PURCHASE:'CLEAR_PURCHASE',
    CHANGE_SHIPMENT:'CHANGE_SHIPMENT',
    CLEAR_SHIPMENT:'CLEAR_SHIPMENT',
    CHANGE_SUPPLIER:'CHANGE_SUPPLIER',
    CLEAR_SUPPLIER:'CLEAR_SUPPLIER',
    CHANGE_SAMPLINGDEPLOY:'CHANGE_SAMPLINGDEPLOY',
    CLEAR_SAMPLINGDEPLOY:'CLEAR_SAMPLINGDEPLOY',
    CHANGE_SAMPLING:'CHANGE_SAMPLING',
    CLEAR_SAMPLING:'CLEAR_SAMPLING',
    CHANGE_ENTERPRISE_SELECT:'CHANGE_ENTERPRISE_SELECT',
    CHANGE_ENTERPRISE_INPUT:'CHANGE_ENTERPRISE_INPUT',
    CHANGE_ADD_MODAL:'CHANGE_ADD_MODAL',
    CHANGE_INPUT:'CHANGE_INPUT',


    //投诉举报
    CHANGE_RADIO_METHOD:'CHANGE_RADIO_METHOD'
}
export const addTabs=(panes,activeKey)=>{
    return {
        panes,
        activeKey,
        type:type.ADD_TABS,
    }
}

export const changeTabs=(activeKey)=>{
    return{
        activeKey,
        type:type.CHANGE_TABS,

    }
}

export const addDataAcl=(industryList,areaList,userName,userType,acls,userInfo)=>{
    return {
        industryList,
        areaList,
        userType,
        userName,
        acls,
        userInfo,
        type:type.ADD_DATA_ACL,
    }
}

export const refreshUser=()=>{
    return {
        type:type.REFRESH_USER,
    }
}

export const changeParchive=(parchive)=>{
    return{
        parchive,
        type:type.CHANGE_PARCHIVE,
    }
}

export const changeParchiveInput=(value,which)=>{
    return{
        value,
        which,
        type:type.CHANGE_PARCHIVE_INPUT,
    }
}
export const changeGovernment=(government)=>{
    return {
        government,
        type:type.CHANGE_GOVERNMENT,
    }
}
export const changeEnterprise=(enterprise)=>{
    return {
        enterprise,
        type:type.CHANGE_ENTERPRISE,
    }
}
export const changeEmployee=(employee)=>{
    return{
        employee,
        type:type.CHANGE_EMPLOYEE
    }
}
export const changeMaterial=(material)=>{
    return{
        material,
        type:type.CHANGE_MATERIAL
    }
}
export const changeLedger=(ledger)=>{
    return{
        ledger,
        type:type.CHANGE_LEDGER
    }
}
export const changeAdditive=(additive)=>{
    return{
        additive,
        type:type.CHANGE_ADDITIVE
    }
}
export const changeQuickcheck=(quickcheck)=>{
    return{
        quickcheck,
        type:type.CHANGE_QUICKCHECK
    }
}
export const changeGovquick=(govquick)=>{
    return{
        govquick,
        type:type.CHANGE_GOVQUICK
    }
}
export const changeCquick=(cquick)=>{
    return{
        cquick,
        type:type.CHANGE_CQUICK
    }
}
export const changeGquick=(gquick)=>{
    return{
        gquick,
        type:type.CHANGE_GQUICK
    }
}

export const changeWaste=(waste)=>{
    return{
        waste,
        type:type.CHANGE_WASTE,
    }
}

export const changeCleaning=(cleaning)=>{
    return {
        cleaning,
        type:type.CHANGE_CLEANING,
    }
}
export const changeDishes=(dishes)=>{
    return {
        dishes,
        type:type.CHANGE_DISHES,
    }
}
export const changeParty=(party)=>{
    return {
        party,
        type:type.CHANGE_PARTY,
    }
}
export const changeSimple=(simple)=>{
    return {
        simple,
        type:type.CHANGE_SIMPLE,
    }
}
export const changePurchase=(purchase)=>{
    return {
        purchase,
        type:type.CHANGE_PURCHASE,
    }
}
export const changeShipment=(shipment)=>{
    return {
        shipment,
        type:type.CHANGE_SHIPMENT,
    }
}
export const changeSupplier=(supplier)=>{
    return {
        supplier,
        type:type.CHANGE_SUPPLIER,
    }
}
export const changeSamplingdeploy=(samplingdeploy)=>{
    return {
        samplingdeploy,
        type:type.CHANGE_SAMPLINGDEPLOY,
    }
}
export const changeSampling=(sampling)=>{
    return {
        sampling,
        type:type.CHANGE_SAMPLING,
    }
}


export const changeGovernmentInput=(value,which)=>{
    return{
        value,
        which,
        type:type.CHANGE_GOVERNMENT_INPUT,
    }
}
export const changeGovernmentSelect=(value,which)=>{
    return{
        value,
        which,
        type:type.CHANGE_GOVERNMENT_SELECT,
    }
}
export const changeEnterpriseInput=(value,which)=>{
    return{
        value,
        which,
        type:type.CHANGE_ENTERPRISE_INPUT,
    }
}
export const changeEnterpriseSelect=(value,which)=>{
    return{
        value,
        which,
        type:type.CHANGE_ENTERPRISE_SELECT,
    }
}
export const changeSmallcatering=(smallcatering)=>{
    return{
        smallcatering,
        type:type.CHANGE_SMALLCATERING,
    }

}
// export const changeWaste=(waste)=>{
//     return{
//         waste,
//         type:type.CHANGE_WASTE,
//     }
// }
//改变表单输入数据
export const changeInputValue = (value) => {
    console.log(value)
    return {
        value,
        type:type.CHANGE_INPUT_VALUE
    }
}

export const changeSelectValue = (labels,value) => {
    return {
        labels,
        value,
        type:type.CHANGE_SELECT_VALUE
    }
}


export const clearInput = () => {
    return {
        type:type.CLEAR_INPUT,
    }
}

export const clearEnterprise = () => {
    return {
        type:type.CLEAR_ENTERPRISE,
    }
}
export const clearLedger = () => {
    return {
        type:type.CLEAR_LEDGER,
    }
}
export const clearWaste = () => {
    return {
        type:type.CLEAR_WASTE,
    }
}
export const clearMaterial = () => {
    return {
        type:type.CLEAR_MATERIAL,
    }
}
export const clearAdditive = () => {
    return {
        type:type.CLEAR_ADDITIVE,
    }
}
export const clearQuickcheck = () => {
    return {
        type:type.CLEAR_QUICKCHECK,
    }
}
export const clearGovquick = () => {
    return {
        type:type.CLEAR_GOVQUICK,
    }
}
export const clearCquick = () => {
    return {
        type:type.CLEAR_CQUICK,
    }
}
export const clearGquick = () => {
    return {
        type:type.CLEAR_GQUICK,
    }
}
export const clearEmployee = () => {
    return {
        type:type.CLEAR_EMPLOYEE,
    }
}

export const clearGovernment = () => {
    return {
        type:type.CLEAR_GOVERNMENT,
    }
}





export const clearCleaning = () => {
    return {
        type:type.CLEAR_CLEANING,
    }
}
export const clearDishes = () => {
    return {
        type:type.CLEAR_DISHES,
    }
}
export const clearParty = () => {
    return {
        type:type.CLEAR_PARTY,
    }
}
export const clearSimple = () => {
    return {
        type:type.CLEAR_SIMPLE,
    }
}
export const clearPurchase = () => {
    return {
        type:type.CLEAR_PURCHASE,
    }
}
export const clearShipment = () => {
    return {
        type:type.CLEAR_SHIPMENT,
    }
}
export const clearSupplier = () => {
    return {
        type:type.CLEAR_SUPPLIER,
    }
}
export const clearSamplingdeploy = () => {
    return {
        type:type.CLEAR_SAMPLINGDEPLOY,
    }
}
export const clearSampling = () => {
    return {
        type:type.CLEAR_SAMPLING,
    }
}

export const changeInput = (input) => {
    return {
        type:type.CHANGE_INPUT,
        input
    }
}

export const changeAddModal = (isVisible) => {
    console.log("uu")
    return {
        isVisible,
        type:type.CHANGE_ADD_MODAL
    }
}

//投诉举报
export const changeRadioMethod = (radioMethod) => {
    return {
        radioMethod,
        type:type.CHANGE_RADIO_METHOD
    }
}
