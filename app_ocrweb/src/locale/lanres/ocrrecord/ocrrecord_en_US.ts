
export default {
	views: {
		gridview: {
			caption: '识别记录',
		},
		editview: {
			caption: '识别记录',
		},
		ocrview: {
			caption: '识别记录',
		},
	},
	main_form: {
		details: {
			group1: '识别记录基本信息', 
			formpage1: '基本信息', 
			group2: '操作信息', 
			formpage2: '其它', 
			srfupdatedate: '更新时间', 
			srforikey: '', 
			srfkey: '识别记录标识', 
			srfmajortext: '识别记录名称', 
			srftempmode: '', 
			srfuf: '', 
			srfdeid: '', 
			srfsourcekey: '', 
			ocrrecordname: '识别记录名称', 
			createman: '建立人', 
			createdate: '建立时间', 
			updateman: '更新人', 
			updatedate: '更新时间', 
			ocrrecordid: '识别记录标识', 
		},
		uiactions: {
		},
	},
	main_grid: {
		columns: {
			ocrrecordid: '识别记录标识',
			ocrrecordname: '识别记录名称',
			procstate: '处理状态',
			updatedate: '更新时间',
		},
		uiactions: {
		},
	},
	default_searchform: {
		details: {
			formpage1: '常规条件', 
			n_ocrrecordid_like: '记录标识别', 
			n_ocrrecordname_like: '记录名称', 
			n_procstate_eq: '处理状态', 
			n_updatedate_gtandeq: '更新时间>=', 
			n_updatedate_ltandeq: '更新时间<=', 
		},
		uiactions: {
		},
	},
	gridviewtoolbar_toolbar: {
		tbitem19: {
			caption: 'Filter',
			tip: 'tbitem19',
		},
	},
	editviewtoolbar_toolbar: {
		tbitem3: {
			caption: 'Save',
			tip: 'tbitem3',
		},
		tbitem4: {
			caption: 'Save And New',
			tip: 'tbitem4',
		},
		tbitem5: {
			caption: 'Save And Close',
			tip: 'tbitem5',
		},
		tbitem6: {
			caption: '-',
			tip: 'tbitem6',
		},
		tbitem7: {
			caption: 'Remove And Close',
			tip: 'tbitem7',
		},
		tbitem8: {
			caption: '-',
			tip: 'tbitem8',
		},
		tbitem12: {
			caption: 'New',
			tip: 'tbitem12',
		},
		tbitem13: {
			caption: '-',
			tip: 'tbitem13',
		},
		tbitem14: {
			caption: 'Copy',
			tip: 'tbitem14',
		},
		tbitem16: {
			caption: '-',
			tip: 'tbitem16',
		},
		tbitem23: {
			caption: '第一个记录',
			tip: 'tbitem23',
		},
		tbitem24: {
			caption: '上一个记录',
			tip: 'tbitem24',
		},
		tbitem25: {
			caption: '下一个记录',
			tip: 'tbitem25',
		},
		tbitem26: {
			caption: '最后一个记录',
			tip: 'tbitem26',
		},
		tbitem21: {
			caption: '-',
			tip: 'tbitem21',
		},
		tbitem22: {
			caption: 'Help',
			tip: 'tbitem22',
		},
	},
};