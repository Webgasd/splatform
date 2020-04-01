const menuList = [
    {
        title: '首页',
        key: '/home'
    },
    {
        title: '监管档案',
        key: '/home',
        children: [{
            title:'人员信息管理',
            key:'/person',
            children:[
            {
             title: '政府工作人员信息',
             key: '/person/goverment'
            },
            {
            title: '企业从业人员信息',
            key: '/person/employee'
            },
            {
                title: '企业人员档案',
                key: '/person/parchive'
            },
           ]
           },
           {
            title:'企业基本档案',
            key:'/enterpriseInformation',
           },
            {
             title: '信用档案管理置',
             key: '/carchive'
            },
           {
            title:'企业基础信息配置',
            key:'/configure',
            children:[
            {
             title: '发证机关配置',
             key: '/configure/licence'
            },
            {
            title: '类别配置',
            key: '/configure/category'
            },
            {
                title: '食品生产大类',
                key: '/configure/big'
           },
           {
                title: '食品生产小类',
                key: '/configure/subclass'
            },
            {
                title: '食品生产类别配置',
                key: '/configure/foodconduct'
            },
             ]
           }
        ]
    },
    {
        title: '明厨亮灶',
        key: '/video',
        children: [
            {
                title: '明厨亮灶',
                key: '/video/v'
            },
            {
                title: '视频配置',
                key: '/video/p'
            },
        ]
    },
    {
        title: '业务职能',
        key: '/Business',
        children: [
            {
                title: '餐饮单位检查',
                key: '/Business/restaurantscheck'
            },
            {
                title: '小餐饮日常监督',
                key: '/Business/smallcatering'
            },
            {
                title: '食品摊点日常监督',
                key: '/Business/foodstall'
            },
            {
                title: '食品摊点日常监督',
                key: '/Business/spotcheck'
            },
            {
                title: '食品小作坊日常监督',
                key: '/Business/smallworkshop'
            },
            {
                title: '食品生产环节检查',
                key: '/Business/production'
            },
            {
                title: '食品销售环节检查',
                key: '/Business/foodsales'
            }, {
                title: '快检数据备案',
                key: '/Business/quickcheck'
            }, {
                title: '快检数据管理',
                key: '/Business/govquickcheck'
            }, {
                title: '快检数据统计',
                key: '/Business/quickcharts'
            },
            {
                title: '药品经营环节检查',
                key: '/Business/drugmanagement'
            },
            {
                title: '药品使用环节检查',
                key: '/Business/druguse'
            },
            {
                title: '专项工作',
                key: '/Business/specialwork'
            },
            {
                title: '动态评级',
                key: '/Business/grade',
                children: [
                    {
                        title: '动态评级',
                        key: '/Business/grade/dynamic'
                    },
                    {
                        title: '量化分级查询',
                        key: '/Business/grade/query'
                    },
                ]
            },
            {
                title: '双随机管理',
                key: '/Business/random'
            },
            {
                title: '双随机检查',
                key: '/Business/randomcheck'
            },
            {
                title: '抽检数据备案',
                key: '/Business/sampling'
            },
            {
                title: '抽检备案管理',
                key: '/Business/gsampling'
            },
            {
                title: '配置项管理',
                key: '/Business/configmanager',
                children: [
                    {
                        title: '文书配置',
                        key: '/Business/configmanager/book'
                    },
                    {
                        title: '评级大类配置',
                        key: '/Business/configmanager/bigclass'
                    },
                    {
                        title: '评级小类配置',
                        key: '/Business/configmanager/smallclass'
                    },
                    {
                        title: '评级项配置',
                        key: '/Business/configmanager/ratingitem'
                    },
                    {
                        title: '监督检查大类配置',
                        key: '/Business/configmanager/big'
                    },
                    {
                        title: '监督检查小类配置',
                        key: '/Business/configmanager/small'
                    },

                    {
                        title: '双随机配置',
                        key: '/Business/configmanager/random'
                    }, {
                        title: '快检机构配置',
                        key: '/Business/configmanager/quickcheck'
                    },  {
                        title: '快检机构配置',
                        key: '/Business/configmanager/gquickcheck'
                    }, {
                        title: '快检产品配置',
                        key: '/Business/configmanager/qcproduct'
                    },{
                        title: '检查结果配置',
                        key: '/Business/configmanager/result'
                    },
                    {
                        title: '抽检机构配置',
                        key: '/Business/configmanager/spotcheck'
                    },
                    {
                        title: '抽检机构管理',
                        key: '/Business/configmanager/gspotcheck'
                    },
                    {
                        title: '抽检处置配置',
                        key: '/Business/configmanager/disposaltype'
                    },
                    {
                        title: '抽检类型配置',
                        key: '/Business/configmanager/checktype'
                    },
                    {
                        title: '抽检日期配置',
                        key: '/Business/configmanager/datetype'
                    },
                    {
                        title: '抽检食品配置',
                        key: '/Business/configmanager/foodtype'
                    },
                ]
            },
        ]
    },
    {
        title: '规范经营',
        key: '/Management',
        children: [
            {
                title: '餐饮单位在线备案',
                key: '/Management/recording',
                children: [
                    {
                        title: '原料索证',
                        key: '/Management/recording/material'
                    },
                    {
                        title: '清洗消毒',
                        key: '/Management/recording/cleaning'
                    },
                    {
                        title: '废弃物记录',
                        key: '/Management/recording/waste'
                    },
                    {
                        title: '聚餐登记',
                        key: '/Management/recording/party'
                    },
                    {
                        title: '添加剂备案',
                        key: '/Management/recording/additive'
                    },
                    {
                        title: '食品留样',
                        key: '/Management/recording/simple'

                    },
                    {
                        title: '图片台账',
                        key: '/Management/recording/ledger'
                    },
                    {
                        title: '菜品管理',
                        key: '/Management/recording/dishes'
                    },
                ]
            },
            {
                title: '规范经营管理',
                key: '/Management/adminrecord',
                children: [
                    {
                        title: '管理原料索证',
                        key: '/Management/adminrecord/material'
                    },
                    {
                        title: '管理清洗消毒',
                        key: '/Management/adminrecord/cleaning'
                    },
                    {
                        title: '管理废弃物',
                        key: '/Management/adminrecord/waste'
                    },
                    {
                        title: '管理聚餐',
                        key: '/Management/adminrecord/party'
                    },
                    {
                        title: '管理添加剂',
                        key: '/Management/adminrecord/additive'
                    },
                    {
                        title: '管理食品留样',
                        key: '/Management/adminrecord/simple'

                    },
                    {
                        title: '管理图片台账',
                        key: '/Management/adminrecord/ledger'
                    },
                    {
                        title: '管理菜品',
                        key: '/Management/adminrecord/dishes'
                    },
                    {
                        title: '管理进货',
                        key: '/Management/adminrecord/purchase'
                    },
                    {
                        title: '管理出货',
                        key: '/Management/adminrecord/shipment'
                    },
                    {
                        title: '管理库存',
                        key: '/Management/adminrecord/stock'
                    },
                ]
            },
            {
                title: '规范经营查阅',
                key: '/Management/operation',
                children: [
                    {
                        title: '原料索证',
                        key: '/Management/operation/material'
                    },
                    {
                        title: '清洗消毒',
                        key: '/Management/operation/cleaning'
                    },
                    {
                        title: '废弃物记录',
                        key: '/Management/operation/waste'
                    },
                    {
                        title: '聚餐登记管理',
                        key: '/Management/operation/party'
                    },
                    {
                        title: '添加剂备案管理',
                        key: '/Management/operation/additive'
                    },
                    {
                        title: '食品留样',

                        key: '/Management/operation/simple'

                    },
                    {
                        title: '图片台账',
                        key: '/Management/operation/ledger'
                    },
                    {
                        title: '菜品管理',
                        key: '/Management/recording/dishes'
                    }

                ]
            },
            {
                title: '流通台账',
                key: '/Management/circulation',
                children: [
                    {
                        title: '进货',
                        key: '/Management/circulation/purchase'
                    },
                    {
                        title: '出货',
                        key: '/Management/circulation/shipment'
                    },
                    {
                        title: '库存',
                        key: '/Management/circulation/stock'
                    },
                    {
                        title: '库存查阅',
                        key: '/Management/circulation/qstock'
                    },
                ]
            },
            {
                title: '台账配置',
                key: '/Management/configmanager',
                children: [
                    {
                        title: '供应商配置',
                        key: '/Management/configmanager/supplier'
                    },
                    {
                        title: '有效期配置',
                        key: '/Management/configmanager/validity'
                    },
                    {
                        title: '原料类别配置',
                        key: '/Management/configmanager/category'
                    },
                    {
                        title: '原料库配置',
                        key: '/Management/configmanager/bank'
                    },
                    {
                        title: '菜品分类',
                        key: '/Management/configmanager/dishes'
                        
                    },
                    {
                        title: '回收企业配置',
                        key: '/Management/configmanager/recovery'
                    },
                ]
            },
        ]
    },
    {
        title: '地图',
        key: '/enterpriseMap'
    },
    {
        title: '统计分析',
        key: '/charts',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar'
            },
            {
                title: '饼图',
                key: '/charts/pie'
            },
            {
                title: '折线图',
                key: '/charts/line'
            },
            {
                title: '折线图',
                key: '/charts/samplinganalysis'
            }

        ]
    },
    {
        title: '远程培训',
        key: '/train',
        children: [
            {
                title: '在线培训人员',
                key: '/train/trainPerson'
            },
            {
                title: '在线培训课程',
                key: '/train/trainCourse'
            },
            {
                title: '在线考试类型',
                key: '/train/examType'
            },{
                title: '在线考试查询',
                key: '/train/examEnquiry'
            },{
                title: '行业类别',
                key: '/train/industryCategory'
            },{
                title: '工作种类',
                key: '/train/workType'
            },{
                title: '培训教材',
                key: '/train/trainMaterial'
            },{
                title: '题库管理',
                key: '/train/topicManage'
            },{
                title: '考题设置',
                key: '/train/examSubject'
            },
        ]
    },
    {
        title: '在线考试',
        key: '/exam',
        children: [
            {
                title: '远程培训',
                key: '/exam/course',
            },
            {
                title: '在线考试',
                key: '/exam/onlineExam'
            },{
                title: '我的信息',
                key: '/exam/myExam'
            },
        ]
    },
    {
        title: '平台管理',
        key: '/splatManager',
        children: [
            {
                title: '部门管理',
                key: '/deptManager',
            },
            {
                title: '用户管理',
                key: '/userManager'
            },
            {
                title: '角色管理',
                key: '/roleManager',
            },
            {
                title: '权限管理',
                key: '/permManager'
            },
        ]
    },
    {
        title: '监控',
        key: '/monitor',
        children: [
            {
                title: '监控控制',
                key: '/monitor/control'
            },
            {
                title: '外卖监控',
                key: '/monitor/takeOut'
            },
        ]
    },
    {
        title: 'test',
        key: '/test'
    },
];
export default menuList;