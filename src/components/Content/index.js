import React,{Component} from 'react';
import loadable from '../../utils/loadable';

const Home = loadable(()=>import('./../../pages/home'));
// const Home = loadable(()=>import('./../../pages/supervision/map'));
const Footer = loadable(()=>import('../Footer'));
const EnterpriseInformation = loadable(()=>import('../../pages/supervision/enterprise'));
const EnterpriseInformationEx = loadable(()=>import('../../pages/supervision/enterpriseEx'));
const AbnormalEnterprise = loadable(()=>import('../../pages/supervision/enterpriseEx/AbnormalEnterprise'));
const ZombieEnterprise = loadable(()=>import('../../pages/supervision/enterpriseEx/zombieEnterprise'));
const Abnormal = loadable(()=>import('../../pages/supervision/abnormal'));
const ShowPoint = loadable(()=>import('../../pages/grid/showPoint'));
const DrawGrid = loadable(()=>import('../../pages/grid/drawGrid'));
const ShowGrid = loadable(()=>import('../../pages/grid/showGrid'));
const SmileMap = loadable(()=>import('../../pages/grid/smileMap'));
const SearchMap = loadable(()=>import('../../pages/grid/searchMap'));
const DataMap = loadable(()=>import('../../pages/supervision/map'));
const RoleManager = loadable(()=>import('../../pages/permission/roleManager'));
const PermManager = loadable(()=>import('../../pages/permission/permManger'));
const DeptManger = loadable(()=>import('../../pages/permission/deptManager'));
const DutiesManger = loadable(()=>import('../../pages/permission/dutiesManager'));
const UserManger = loadable(()=>import('../../pages/permission/userManager'));
const AreaManger = loadable(()=>import('../../pages/permission/AreaManager'));
const Employee = loadable(()=>import('../../pages/supervision/employee'));
const Licence = loadable(()=>import('../../pages/supervision/licence'));
const Bigclass = loadable(()=>import('../../pages/supervision/bigclass'));
const Foodconduct = loadable(()=>import('../../pages/supervision/foodconduct'));
const Notice = loadable(()=>import('./../../pages/notice'));
const LegalPolicy = loadable(()=>import('./../../pages/legalPolicy'));
const Laws = loadable(()=>import('./../../pages/legalPolicy/laws'));
const Headquarters = loadable(()=>import('./../../pages/legalPolicy/headquarters'));
const Endemicity = loadable(()=>import('./../../pages/legalPolicy/endemicity'));
const EnterpriseInform = loadable(()=>import('./../../pages/officeManagement/enterpriseInform'));
const CheckInform = loadable(()=>import('./../../pages/officeManagement/enterpriseInform/checkInform'));
const Announcement = loadable(()=>import('./../../pages/officeManagement/announcement'));
const DocumentRouting = loadable(()=>import('../../pages/officeManagement/documentRouting'));
const AllocationUnit = loadable(()=>import('../../pages/officeManagement/allocationUnit'));
const PictureCarousel = loadable(()=>import('../../pages/officeManagement/pictureCarousel'))
const PersonnelPool = loadable(()=>import('../../pages/gridMember/personnelPool'))
const TaskDeployment = loadable(()=>import('../../pages/gridMember/taskDeployment'))
const InspectionStatus = loadable(()=>import('../../pages/gridMember/inspectionStatus'))
const InspectDataStatistics = loadable(()=>import('../../pages/gridMember/inspectDataStatistics'))
const ScrollChart = loadable(()=>import('../../pages/gridMember/scrollChart'))
const Interacion = loadable(()=>import('./../../pages/interaction'));
const InteracionEx = loadable(()=>import('./../../pages/interactionEx'));
const V = loadable(()=>import('./../../pages/video'));
const Vp = loadable(()=>import('./../../pages/videop'));
const Vd = loadable(()=>import('./../../pages/videoDeal'));
const Vr = loadable(()=>import('./../../pages/videoRecord'));
const EnterpriseVideo = loadable(()=>import('./../../pages/videoEnterprise'));
const HikIscVideoConfig = loadable(()=>import('./../../pages/HIKResource/videoConfig'));
const HikISCVideoPlayer = loadable(()=>import('../../pages/HIKResource/iscVideoPlay'));
const EnterpriseVideoISC = loadable(()=>import('./../../pages/videoEnterpriseISC'));


const Government = loadable(()=>import('../../pages/supervision/government'));
const Parchive = loadable(()=>import('../../pages/supervision/parchive'));
const Carchive = loadable(()=>import('../../pages/supervision/carchive'));
const Category = loadable(()=>import('../../pages/supervision/category'));
const Subclass = loadable(()=>import('../../pages/supervision/subclass'));

const Restaurantcheck = loadable(()=>import('../../pages/inspect/restaurantscheck'));
const Foodstall = loadable(()=>import('../../pages/inspect/foodstall'));
const InspectProduction = loadable(()=>import('../../pages/inspect/production'));
const InspectCirculation = loadable(()=>import('../../pages/inspect/circulation'));
const Drugmanagement = loadable(()=>import('../../pages/inspect/drugmanagement'));
const Smallcatering = loadable(()=>import('../../pages/inspect/smallcatering'));
const Smallworkshop = loadable(()=>import('../../pages/inspect/smallworkshop'));
const Foodsales = loadable(()=>import('../../pages/inspect/foodsales'));
const Druguse = loadable(()=>import('../../pages/inspect/drugmanagement'));
const Specialwork = loadable(()=>import('../../pages/inspect/specialwork'));
const Query = loadable(()=>import('../../pages/inspect/query'));
const Dynamic = loadable(()=>import('../../pages/inspect/dynamic'));
const Randomcheck = loadable(()=>import('../../pages/inspect/randomcheck'));
const Random = loadable(()=>import('../../pages/inspect/random'));
const Book = loadable(()=>import('../../pages/inspect/book'));
const Sampling = loadable(()=>import('../../pages/inspect/spotcheckcheck/sampling'));
const Gsampling = loadable(()=>import('../../pages/inspect/spotcheckcheck/gsampling'));
const Spotchecktype = loadable(()=>import('../../pages/inspect/spotcheckcheck/spotdeploytype/checktype'));
const Spotdatetype = loadable(()=>import('../../pages/inspect/spotcheckcheck/spotdeploytype/datetype'));
const Spotdisposaltype = loadable(()=>import('../../pages/inspect/spotcheckcheck/spotdeploytype/disposaltype'));
const Spotfoodtype = loadable(()=>import('../../pages/inspect/spotcheckcheck/spotdeploytype/foodtype'));
const Dsamplingdeploy = loadable(()=>import('../../pages/inspect/spotcheckcheck/dsamplingdeploy'));
const Gsamplingdeploy = loadable(()=>import('../../pages/inspect/spotcheckcheck/gsamplingdeploy'));
const Samplinganalysis = loadable(()=>import('../../pages/inspect/spotcheckcheck/AdminSpotCheck'));
const AdminSpotCheck = loadable(()=>import('./../../pages/inspect/quick/AdminQuickCheck'));
const Sign = loadable(()=>import('../../pages/inspect/sign'));
const Lllegality = loadable(()=>import('../../pages/inspect/lllegality'));
const Legal = loadable(()=>import('../../pages/inspect/legal'));
const Hierarchicalquery = loadable(()=>import('../../pages/inspect/hierarchicalquery'));


const Material = loadable(()=>import('./../../pages/operate/on_record/material'));
const Waste = loadable(()=>import('./../../pages/operate/on_record/waste'));
const Additive = loadable(()=>import('./../../pages/operate/on_record/additive'));
const Ledger = loadable(()=>import('./../../pages/operate/on_record/ledger'));
const LedgerEqup = loadable(()=>import('./../../pages/operate/on_record/ledgerEqup'));
const LedgerEqup1 = loadable(()=>import('./../../pages/operate/check/ledgerEqup'));
const LedgerEqup2 = loadable(()=>import('./../../pages/operate/adminrecord/ledgerEqup'));
const Stock = loadable(()=>import('./../../pages/operate/account/stock'));
const Qstock = loadable(()=>import('./../../pages/operate/account/qstock'));
const Validity = loadable(()=>import('./../../pages/operate/deploy/valid'));
const Bank = loadable(()=>import('./../../pages/operate/deploy/bank'));
const Material1 = loadable(()=>import('./../../pages/operate/check/material'));
const Additive1 = loadable(()=>import('./../../pages/operate/check/additive'));
const Waste1 = loadable(()=>import('./../../pages/operate/check/waste'));
const Ledger1 = loadable(()=>import('./../../pages/operate/check/ledger'));
const Material3 = loadable(()=>import('./../../pages/operate/on_record/material3'));
const Material4 = loadable(()=>import('./../../pages/operate/check/material3'));
const Material5 = loadable(()=>import('./../../pages/operate/adminrecord/material3'));

const Course = loadable(()=>import('./../../pages/exam/course'));
const OnlineExam = loadable(()=>import('../../pages/exam/onlineExam'));
const WorkType = loadable(()=>import('../../pages/permission/workType'));
const TopicManage = loadable(()=>import('./../../pages/train/topicManage'));
const TrainPerson = loadable(()=>import('./../../pages/train/trainPerson'));
const TrainMaterial = loadable(()=>import('./../../pages/train/trainMaterial'));
const TrainCourse = loadable(()=>import('./../../pages/train/trainCourse'));
const IndustryCategory = loadable(()=>import('../../pages/permission/industryCategory'));
const ExamType = loadable(()=>import('./../../pages/train/examType'));
const ExamSubject = loadable(()=>import('./../../pages/train/examSubject'));
const ExamEnquiry = loadable(()=>import('./../../pages/train/examEnquiry'));
const MyExam = loadable(()=>import('./../../pages/exam/MyExam'));
const Businessbigclass = loadable(()=>import('../../pages/inspect/businessbigclass'));
const Businesssmallclass = loadable(()=>import('../../pages/inspect/businesssmallclass'));
const Ratingitem = loadable(()=>import('../../pages/inspect/ratingitem'));
const Configmanagerbig = loadable(()=>import('../../pages/inspect/configmanagerbig'));
const Configmanagersmall = loadable(()=>import('../../pages/inspect/configmanagersmall'));
const Configmanagerrandom = loadable(()=>import('../../pages/inspect/configmanagerrandom'));
const Tab = loadable(()=>import('./../../pages/test'));

const Cleaning = loadable(()=>import('./../../pages/operate/on_record/cleaning'));
const Cleaning1 = loadable(()=>import('./../../pages/operate/check/cleaning'));
const Party = loadable(()=>import('./../../pages/operate/on_record/party'));
const Party1 = loadable(()=>import('./../../pages/operate/check/party'));
const Simple = loadable(()=>import('./../../pages/operate/on_record/simple'));
const Simple1 = loadable(()=>import('./../../pages/operate/check/simple'));
const Dishes = loadable(()=>import('./../../pages/operate/on_record/dishes'));
const Purchase = loadable(()=>import('./../../pages/operate/account/purchase'));
const PurchaseSup = loadable(()=>import('./../../pages/operate/account/purchaseSup'));
const Shipment = loadable(()=>import('./../../pages/operate/account/shipment'));
const ShipmentSup = loadable(()=>import('./../../pages/operate/account/shipmentSup'));
const Supplier = loadable(()=>import('./../../pages/operate/deploy/supplier'));
const Category1 = loadable(()=>import('./../../pages/operate/deploy/category'));
const Dishes1 = loadable(()=>import('./../../pages/operate/deploy/dishes'));
const Recovery = loadable(()=>import('./../../pages/operate/deploy/recovery'));

const Material2 = loadable(()=>import('./../../pages/operate/adminrecord/material'));
const Waste2 = loadable(()=>import('./../../pages/operate/adminrecord/waste'));
const Additive2 = loadable(()=>import('./../../pages/operate/adminrecord/additive'));
const Ledger2 = loadable(()=>import('./../../pages/operate/adminrecord/ledger'));
const Cleaning2 = loadable(()=>import('./../../pages/operate/adminrecord/cleaning'));
const Party2 = loadable(()=>import('./../../pages/operate/adminrecord/party'));
const Simple2 = loadable(()=>import('./../../pages/operate/adminrecord/simple'));
const Dishes2 = loadable(()=>import('./../../pages/operate/adminrecord/dishes'));
const Stock2 = loadable(()=>import('./../../pages/operate/adminrecord/stock'));
const Purchase2 = loadable(()=>import('./../../pages/operate/adminrecord/purchase'));
const Shipment2 = loadable(()=>import('./../../pages/operate/adminrecord/shipment'));

const Quickcheck = loadable(()=>import('./../../pages/inspect/quick/quickcheck'));
const Cquickcheck = loadable(()=>import('./../../pages/inspect/quick/cquickcheck'));
const Gquickcheck = loadable(()=>import('./../../pages/inspect/quick/gquickcheck'));
const Qcproduct = loadable(()=>import('./../../pages/inspect/quick/qcproduct'));
const Result = loadable(()=>import('./../../pages/inspect/quick/result'));
const Govquickcheck = loadable(()=>import('./../../pages/inspect/quick/govquickcheck'));
const Quickcharts = loadable(()=>import('./../../pages/inspect/quick/quickcharts'));
const AdminQuickCheck = loadable(()=>import('./../../pages/inspect/quick/AdminQuickCheck'));
const Record = loadable(()=>import('./../../pages/record/record/record'));
const CallType = loadable(()=>import('./../../pages/record/setup/calltype'));
const MessageSource = loadable(()=>import('./../../pages/record/setup/messagesource'));
const Urgency = loadable(()=>import('./../../pages/record/setup/urgency'));
const QuestionSortOne = loadable(()=>import('./../../pages/record/setup/questionsortone'));
const QuestionSortTwo = loadable(()=>import('./../../pages/record/setup/questionsorttwo'));
const Analysis = loadable(()=>import('./../../pages/record/statistics/analysis'));

const EquipmentTypeOne = loadable(()=>import('./../../pages/specialEquipment/set/equipmentTypeOne'));
const EquipmentTypeTwo = loadable(()=>import('./../../pages/specialEquipment/set/equipmentTypeTwo'));
const EquipmentTypeThree = loadable(()=>import('./../../pages/specialEquipment/set/equipmentTypeThree'));
const EquipmentIndustry = loadable(()=>import('./../../pages/specialEquipment/set/equipmentIndustry'));
const HIKHost = loadable(()=>import('./../../pages/HIKResource/host'));
const HIKRegionsAll = loadable(()=>import('./../../pages/HIKResource/regionsAll'));
const HIKURLSearch = loadable(()=>import('./../../pages/HIKResource/URLSearch'));

export default class Content extends Component{
    getContent =()=>{
        switch (this.props.name) {
            case '/home':
                return <Home/>
                case '/test':
                    return <Tab/>
            case   '/enterpriseInformation':
                return <EnterpriseInformation/>
            case   '/enterpriseInformationEx':
                return <EnterpriseInformationEx/>
            case   '/enterpriseAbnormal':
                return <AbnormalEnterprise/>
            case    '/zombieEnterprise':
                return <ZombieEnterprise/>
          
            case   '/abnormal':
                return <Abnormal/>
            case '/grid/showPoint':
                return <ShowPoint/>
            case '/grid/drawGrid':
                return <DrawGrid/>
            case '/grid/showGrid':
                return <ShowGrid/>
            case '/grid/smileMap':
                return <SmileMap/>
            case '/grid/searchMap':
                return <SearchMap/>
            case '/dataMap':
                return <DataMap/>
            case '/person/employee':
                return <Employee/>
            case '/person/goverment':
                return <Government/>
            case '/person/parchive':
                return <Parchive/>
            case '/carchive':
                return <Carchive/>
            case '/configure/category':
                return <Category/>
            case '/configure/subclass':
                return <Subclass/>
            case '/configure/licence':
                return <Licence/>
            case '/configure/big':
                return <Bigclass/>
            case '/configure/foodconduct':
                return <Foodconduct/>
            case '/video/v':
                return <V/>
            case '/video/p':
                return <Vp/>
            case '/video/d':
                return <Vd/>
            case '/video/r':
                return <Vr/>
            case '/HIKResource/videoConfig':
                return <HikIscVideoConfig/>
            case '/HIKResource/HikISCVideoPlayer':
                return <HikISCVideoPlayer/>
            case '/videoEnterprise':
                return <EnterpriseVideo/>
            case '/videoEnterpriseISC':
                return <EnterpriseVideoISC/>
            case '/notice':
                return <Notice/>
            case '/legalPolicy':
                return <LegalPolicy/>
            case '/laws':
                return <Laws/>
            case '/headquarters':
                return <Headquarters/>
            case '/endemicity':
                return <Endemicity/>
            case '/enterpriseInform':
                return <EnterpriseInform/>
            case '/checkInform':
                return <CheckInform/>
            case '/announcement':
                return <Announcement/>
            case '/documentRouting':
                return <DocumentRouting/>
            case '/allocationUnit':
                return <AllocationUnit/>
            case '/pictureCarousel':
                return <PictureCarousel/>
            case '/personnelPool':
                return <PersonnelPool/>
            case '/taskDeployment':
                return <TaskDeployment/>
            case '/inspectionStatus':
                return <InspectionStatus/> 
            case '/inspectDataStatistics':
                return <InspectDataStatistics/>
            case '/scrollChart':
                return <ScrollChart/>
            case '/interaction':
                return <Interacion/>
            case '/roleManager':
                return <RoleManager/>
            case '/permManager':
                return <PermManager/>
            case '/deptManager':
                return <DeptManger/>
            case '/dutiesManager':
                return <DutiesManger/>
            case '/userManager':
                return <UserManger/>
            case '/areaManager':
                return <AreaManger/>
            case '/Business/restaurantscheck':
                return <Restaurantcheck/>
            case '/Business/foodstall':
                return <Foodstall/>
            case '/inspect/production':
                return <InspectProduction/>
            case '/inspect/circulation':
                return <InspectCirculation/>
            case '/inspect/hierarchicalquery':
                return <Hierarchicalquery/>
            case '/Business/drugmanagement':
                return <Drugmanagement/>
            case '/Business/smallcatering':
                return <Smallcatering/>
            case '/Business/smallworkshop':
                return <Smallworkshop/>
            case  '/Business/foodsales':
                return <Foodsales/>
            case  '/Business/druguse':
                return <Druguse/>
            case '/Business/specialwork':
                return <Specialwork/>
            case  '/Business/sampling':
                return <Sampling/>
            case  '/Business/gsampling':
                return < Gsampling/>
            case  '/Business/grade/dynamic':
                return < Dynamic/>
            case '/Business/grade/query':
                return <Query/>
            case '/Business/random':
                return <Random/>
            case '/Business/randomcheck':
                return <Randomcheck/>
            case  '/Business/configmanager/book':
                return < Book/>
            case '/Business/configmanager/sign':
                return <Sign/>
            case '/Business/configmanager/lllegality':
                return  <Lllegality/>
            case '/Business/configmanager/legal':
                return  <Legal/>
            case '/Business/configmanager/spotcheck':
                return <Dsamplingdeploy/>
            case '/Business/configmanager/gspotcheck':
                return <Gsamplingdeploy/>
            case '/Business/configmanager/disposaltype':
                return <Spotdisposaltype/>
            case '/Business/configmanager/checktype':
                return <Spotchecktype/>
            case '/Business/configmanager/datetype':
                return <Spotdatetype/>
            case '/Business/configmanager/foodtype':
                return <Spotfoodtype/>
            case '/Business/configmanager/adminSpotCheck':
                return <AdminSpotCheck/>
            case '/Management/recording/cleaning':
                return <Cleaning/>
            case '/Management/recording/party':
                return <Party/>
            case '/Management/recording/simple':
                return <Simple/>
            case '/Management/recording/dishes':
                return <Dishes/>
            case '/Management/operation/cleaning':
                return <Cleaning1/>
            case '/Management/operation/party':
                return <Party1/>
            case '/Management/operation/simple':
                return <Simple1/>
            case '/Management/operation/material':
                return <Material1/>   
            case '/Management/operation/additive':
                return <Additive1/>  
            case '/Management/operation/waste':
                return <Waste1/>
            case '/Management/operation/ledger':
                return <Ledger1/>

            case '/Management/configmanager/recovery':
                return <Recovery/>
            case '/Management/circulation/purchase':
                return <Purchase/>
            case '/Management/configmanager/supplier':
                return <Supplier/>
            case '/Management/configmanager/category':
                return <Category1/>
            case '/Management/configmanager/dishes':
                return <Dishes1/>
            case '/Management/circulation/shipment':
                return <Shipment/>
            case '/charts/samplinganalysis':
                return <Samplinganalysis/>
            case '/exam/course':
                return <Course/>
            case '/exam/onlineExam':
                return <OnlineExam/>
            case '/exam/myExam':
                return <MyExam/>
            case '/train/workType':
                return <WorkType/>
            case '/train/trainPerson':
                return <TrainPerson/>
            case '/train/trainMaterial':
                return <TrainMaterial/>
            case '/train/trainCourse':
                return <TrainCourse/>
            case '/train/topicManage':
                return <TopicManage/>
            case '/train/industryCategory':
                return <IndustryCategory/>
            case '/train/examType':
                return <ExamType/>
            case '/train/examSubject':
                return <ExamSubject/>
            case '/train/examEnquiry':
                return <ExamEnquiry/>
            case '/Business/configmanager/bigclass':
                return <Businessbigclass/>
            case '/Business/configmanager/smallclass':
                return <Businesssmallclass/>
            case '/Business/configmanager/ratingitem':
                return <Ratingitem/>
            case '/Business/configmanager/big':
                return <Configmanagerbig/>
            case '/Business/configmanager/small':
                return <Configmanagersmall/>
            case '/Business/configmanager/random':
                return <Configmanagerrandom/>
            case '/test/tab':
                return <Tab/>
            case '/Management/recording/material':
                return <Material/>
            case '/Management/recording/material3':
                return <Material3/>
            case '/Management/recording/material4':
                return <Material4/> 
            case '/Management/recording/material5':
                return <Material5/>   
            case '/Management/recording/waste':
                return <Waste/>  
            case '/Management/recording/additive':
                return <Additive/>
            case '/Management/recording/ledger':
                return <Ledger/>
            case '/Management/recording/ledgerEqup':
                return <LedgerEqup/>
            case '/Management/check/ledgerEqup':
                return <LedgerEqup1/>
            case '/Management/adminrecord/ledgerEqup':
                return <LedgerEqup2/>
            case '/Management/circulation/stock':
                return <Stock/> 
            case '/Management/circulation/qstock':
                return <Qstock/> 
            case '/Management/configmanager/validity':
                return <Validity/>
            case '/Management/configmanager/bank':
                return <Bank/>
            case '/Management/circulation/qstock':
                return <Qstock/>
            case '/Management/adminrecord/cleaning':
                return <Cleaning2/>
            case '/Management/adminrecord/party':
                return <Party2/>
            case '/Management/adminrecord/simple':
                return <Simple2/>
            case '/Management/adminrecord/dishes':
                return <Dishes2/>
            case '/Management/adminrecord/material':
                return <Material2/>
            case '/Management/adminrecord/waste':
                return <Waste2/>
            case '/Management/adminrecord/additive':
                return <Additive2/>
            case '/Management/adminrecord/ledger':
                return <Ledger2/>
            case '/Management/adminrecord/purchase':
                return <Purchase2/>
            case '/Management/suprecord/purchase':
                return <PurchaseSup/>
            case '/Management/adminrecord/shipment':
                return <Shipment2/>
            case '/Management/suprecord/shipment':
                return <ShipmentSup/>
            case '/Management/adminrecord/stock':
                return <Stock2/>

            case '/Business/quickcheck':
                return <Quickcheck/>
            case '/Business/AdminQuickCheck':
                return <AdminQuickCheck/>
            case '/Business/govquickcheck':
                return <Govquickcheck/>
            case '/Business/configmanager/quickcheck':
                return <Cquickcheck/>
            case '/Business/configmanager/gquickcheck':
                return <Gquickcheck/>
            case '/Business/configmanager/qcproduct':
                return <Qcproduct/>
            case '/Business/configmanager/result':
                return <Result/>
            case '/Business/quickcharts':
                return <Quickcharts/>
            case '/record/record/record':
                return <Record />
            case '/record/setup/calltype':
                return <CallType />
            case '/record/setup/messagesource':
                return <MessageSource />
            case '/record/setup/urgency':
                return <Urgency />
            case '/record/setup/questionsortone':
                return <QuestionSortOne />
            case '/record/setup/questionsorttwo':
                return <QuestionSortTwo />
            case '/record/statistics/analysis':
                return <Analysis />
            case '/interactionEx':
                return <InteracionEx />
            case '/specialEquipment/set/equipmentTypeOne':
                return <EquipmentTypeOne />
            case '/specialEquipment/set/equipmentTypeTwo':
                return <EquipmentTypeTwo />
            case '/specialEquipment/set/equipmentTypeThree':
                return <EquipmentTypeThree />
            case '/specialEquipment/set/equipmentIndustry':
                return <EquipmentIndustry />
            case '/HIKResource/host':
                return <HIKHost />
            case '/HIKResource/regionsAll':
                return <HIKRegionsAll />
            case '/HIKResource/UELSearch':
                return <HIKURLSearch />
            default:
                  return <Home/>
          }
    }
    render() {
        return (
            <div className='content'>
                <div className='mainContent'>
                    {this.getContent()}
                </div>
                <Footer/>
            </div>
        );
    }
}