import {type} from './../action';

const panes = [
    {
        content: '首页',
        title:'首页',
        key:'/home',
        closable: false,
    }
]


const initialState = {
    panes:panes,
    acls:{},
    parchive:{},
    employee:{},
    government:{},
    enterprise:{},
    cleaning:{},
    dishes:{},
    party:{},
    simple:{},
    purchase:{},
    shipment:{},
    supplier:{},
    sampling:{},
    samplingdeploy:{},
    smallcatering:{},
    activeKey: panes[0].key,
    input:{},
    select:{},
    industryList:[],
    areaList:[],
    userType:null,
    userInfo:{},
    userName:'',
    isAddVisible:false,

    //投诉举报
    radioMethod:1
}

export default  (state=initialState,action)=>{
    switch (action.type) {
        case type.ADD_TABS:
            return{
                ...state,
                panes:action.panes,
                activeKey:action.activeKey
            };
        case type.CHANGE_TABS:
            return{
                ...state,
                activeKey:action.activeKey
            };
        case type.ADD_DATA_ACL:
            return{
                ...state,
                industryList:action.industryList,
                areaList:action.areaList,
                userType:action.userType,
                userName:action.userName,
                acls:action.acls,
                userInfo:action.userInfo
            };
        case type.REFRESH_USER:{
            return {...initialState,panes: [
                    {
                        content: '首页',
                        title:'首页',
                        key:'/home',
                        closable: false,
                    }
                ]}

        }
        case type.CHANGE_PARCHIVE:
            return {
                ...state,
                parchive:action.parchive
            };

        case type.CHANGE_PARCHIVE_INPUT:
            return {
                ...state,
                parchive:{...state.parchive,[action.which]:action.value}
            }
        case type.CHANGE_GOVERNMENT:
            return {
                ...state,
                government: action.government
            }
        case type.CHANGE_CQUICK:
            return {
                ...state,
                cquick: action.cquick
            }
         case type.CHANGE_GQUICK:
            return {
                    ...state,
                gquick: action.gquick
             }          
        case type.CHANGE_QUICKCHECK:
                return {
                    ...state,
                    quickcheck: action.quickcheck
                }
        case type.CHANGE_GOVQUICK:
                return {
                    ...state,
                    govquick: action.govquick
                }
        case type.CHANGE_WASTE:
                return {
                    ...state,
                    waste: action.waste
                }
        case type.CHANGE_LEDGER:
                return {
                    ...state,
                    ledger: action.ledger
                }
        case type.CHANGE_MATERIAL:
                return {
                   ...state,
                   material: action.material
                }
        case type.CHANGE_ADDITIVE:
                return {
                     ...state,
                     additive: action.additive
                }
        case type.CHANGE_ENTERPRISE:
                return {
                    ...state,
                    enterprise: action.enterprise
            }
        case type.CHANGE_EMPLOYEE:
            return{
                ...state,
                employee: action.employee
            }
        case type.CHANGE_CQUICK:
            return {
                ...state,
                cquick: action.cquick
            }
        case type.CHANGE_GQUICK:
            return {
                ...state,
                gquick: action.gquick
            }
        case type.CHANGE_QUICKCHECK:
            return {
                ...state,
                quickcheck: action.quickcheck
            }
        case type.CHANGE_GOVQUICK:
            return {
                ...state,
                govquick: action.govquick
            }
        case type.CHANGE_WASTE:
            return {
                ...state,
                waste: action.waste
            }
        case type.CHANGE_LEDGER:
            return {
                ...state,
                ledger: action.ledger
            }
        case type.CHANGE_MATERIAL:
            return {
                ...state,
                material: action.material
            }
        case type.CHANGE_ADDITIVE:
            return {
                ...state,
                additive: action.additive
            }

        case type.CHANGE_CLEANING:
            return {
                ...state,
                cleaning: action.cleaning
            }
        case type.CHANGE_DISHES:
            return {
                ...state,
                dishes: action.dishes
            }
        case type.CHANGE_PARTY:
            return {
                ...state,
                party: action.party
            }
        case type.CHANGE_SIMPLE:
            return {
                ...state,
                simple: action.simple
            }
        case type.CHANGE_PURCHASE:
            return {
                ...state,
                purchase: action.purchase
            }
        case type.CHANGE_SHIPMENT:
            return {
                ...state,
                shipment: action.shipment
            }
        case type.CHANGE_SUPPLIER:
            return {
                ...state,
                supplier: action.supplier
            }
        case type.CHANGE_SAMPLINGDEPLOY:
            return {
                ...state,
                samplingdeploy: action.samplingdeploy
            }
        case type.CHANGE_SAMPLING:
            return {
                ...state,
                sampling: action.sampling
            }
        case type.CHANGE_GOVERNMENT_INPUT:
            return {
                ...state,
                government:{...state.government,[action.which]:action.value}
            }
        case type.CHANGE_GOVERNMENT_SELECT:
            return {
                ...state,
                government:{...state.government,[action.which]:action.value}
            }
            case type.CHANGE_ENTERPRISE_INPUT:
                return {
                    ...state,
                    enterprise:{...state.enterprise,[action.which]:action.value}
                }
            case type.CHANGE_ENTERPRISE_SELECT:
                return {
                    ...state,
                    enterprise:{...state.enterprise,[action.which]:action.value}
                }
        case type.CHANGE_SMALLCATERING:
            return {
                ...state,
                smallcatering:action.smallcatering
            };

        case type.CHANGE_INPUT_VALUE:
            return {
                ...state,
                input:action.value
            }
        case type.CHANGE_SELECT_VALUE:
            return {
                ...state,
                select:{...state.select,[action.labels]:action.value}
            }
        case type.CLEAR_INPUT:
            return {
                ...state,
                input:{},
                select:{}
            }
        case type.CLEAR_EMPLOYEE:
            return {
                ...state,
                employee:{},
            }
        case type.CLEAR_GOVERNMENT:
            return {
                ...state,
                government:{},
            }
        case type.CLEAR_MATERIAL:
            return {
                ...state,
                material:{},
            }
        case type.CLEAR_WASTE:
            return {
                ...state,
                waste:{},
            }
        case type.CLEAR_LEDGER:
            return {
                ...state,
                ledger:{},
            }
        case type.CLEAR_ADDITIVE:
            return {
                ...state,
                additive:{},
            }
        case type.CLEAR_QUICKCHECK:
            return {
                ...state,
                quickcheck:{},
            }
        case type.CLEAR_GOVQUICK:
             return {
                ...state,
                govquick:{},
            }
        case type.CLEAR_CQUICK:
             return {
                ...state,
                cquick:{},
            }   
        case type.CLEAR_GQUICK:
             return {
                ...state,
               gquick:{},
            }    
        case type.CLEAR_ENTERPRISE:
            return {
                ...state,
                enterprise:{},
            }
        case type.CLEAR_MATERIAL:
            return {
                ...state,
                material:{},
            }
        case type.CLEAR_WASTE:
            return {
                ...state,
                waste:{},
            }
        case type.CLEAR_LEDGER:
            return {
                ...state,
                ledger:{},
            }
        case type.CLEAR_ADDITIVE:
            return {
                ...state,
                additive:{},
            }
        case type.CLEAR_QUICKCHECK:
            return {
                ...state,
                quickcheck:{},
            }
        case type.CLEAR_GOVQUICK:
            return {
                ...state,
                govquick:{},
            }
        case type.CLEAR_CQUICK:
            return {
                ...state,
                cquick:{},
            }
        case type.CLEAR_GQUICK:
            return {
                ...state,
                gquick:{},
            }

        case type.CLEAR_CLEANING:
            return {
                ...state,
                cleaning:{},
            }
        case type.CLEAR_DISHES:
            return {
                ...state,
                dishes:{},
            }
        case type.CLEAR_PARTY:
            return {
                ...state,
                party:{},
            }
        case type.CLEAR_SIMPLE:
            return {
                ...state,
                simple:{},
            }
        case type.CLEAR_PURCHASE:
            return {
                ...state,
                purchase:{},
            }
        case type.CLEAR_SHIPMENT:
            return {
                ...state,
                shipment:{},
            }
        case type.CLEAR_SUPPLIER:
            return {
                ...state,
                supplier:{},
            }
        case type.CLEAR_SAMPLINGDEPLOY:
            return {
                ...state,
                samplingdeploy:{},
            }
        case type.CLEAR_SAMPLING:
            return {
                ...state,
                sampling:{},
            }
        case type.CHANGE_INPUT:
            return {
                ...state,
                input:action.input
            }
        case type.CHANGE_ADD_MODAL:
            return {
                ...state,
                isAddVisible: action.isVisible
            }
            //投诉举报
        case type.CHANGE_RADIO_METHOD:
            return {
                ...state,
                radioMethod:action.radioMethod
            }

        default:
            return state;
    }
}