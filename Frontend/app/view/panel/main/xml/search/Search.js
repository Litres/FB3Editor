/**
 * Панель поиска/замены по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.Search',
    {
        extend: 'Ext.Container',
        requires: [
            'FBEditor.view.panel.main.xml.search.SearchController',
            'FBEditor.view.panel.main.xml.search.close.Close',
	        'FBEditor.view.panel.main.xml.search.find.Find',
	        'FBEditor.view.panel.main.xml.search.replace.Replace'
        ],

        id: 'panel-xml-search',
        xtype: 'panel-xml-search',
        controller: 'panel.xml.search',
	    
	    cls: 'panel-xml-search',

        listeners: {
            change: 'onChange',
	        findNext: 'onFindNext',
	        findPrev: 'onFindPrev'
        },
	
	    layout: 'hbox',
	    width: '100%',

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Xml} Редактор xml.
         */
        xmlPanel: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.find.Find} Панель поиска.
	     */
	    findPanel: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.replace.Replace} Панель замены.
	     */
	    replacePanel: null,

        initComponent: function ()
        {
            var me = this;

            me.items = [
	            {
	            	xtype: 'container',
		            layout: 'vbox',
		            flex: 1,
		            items: [
			            {
				            xtype: 'panel-xml-search-find'
			            },
			            {
				            xtype: 'panel-xml-search-replace'
			            }
		            ]
	            },
                {
                    xtype: 'panel-xml-search-close'
                }
            ];

            me.callParent(arguments);
        },
        
        afterHide: function ()
        {
	        var me = this,
		        xmlPanel,
                manager;
	
	        xmlPanel = me.getXmlPanel();
	        manager = xmlPanel.getManager();
	        
	        // убираем подсветку текста после предыдущего поиска
	        manager.search();

	        me.callParent(arguments);
        },
	
	    /**
	     * Устанавливает в поле поиска фокус и выделнную часть текста из редактора xml.
	     */
	    setFocusSearchField: function ()
	    {
		    var me = this,
			    xmlPanel,
			    manager,
			    proxyEditor,
			    text,
			    findPanel,
			    searchField;
		
		    xmlPanel = me.getXmlPanel();
		    manager = xmlPanel.getManager();
		    proxyEditor = manager.getProxyEditor();
		    findPanel = me.getFindPanel();
		    searchField = findPanel.getSearchField();
		
		    // получаем выделенный текст из редактора
		    text = proxyEditor.getSelection();
		
		    if (text)
		    {
			    // устанавилваем выделенный текст в поле поиска
			    searchField.setValue(text);
		    }
		
		    // ставим фокус в поле поиска
		    searchField.focus(true);
	    },
	
	    /**
	     * Выполнняет замену.
	     * @param {Boolean} [all] Заменить ли все совпадения.
	     */
	    replace: function (all)
	    {
		    var me = this,
			    replacePanel,
			    replaceField,
			    xmlPanel,
			    xmlManager,
			    replaceStr,
		        count;
		
		    replacePanel = me.getReplacePanel();
		    xmlPanel = me.getXmlPanel();
		    xmlManager = xmlPanel.getManager();
		
		    // строка для замены
		    replaceField = replacePanel.getReplaceField();
		    replaceStr = replaceField.getValue();
		
		    // выполняем замену
		    count = xmlManager.replace(replaceStr, all);
		    
		    if (Ext.isNumber(count))
		    {
		    	me.setCount(count);
		    }
	    },
	
	    /**
	     * Устанавливает количество найденных результатов.
	     * @param {Number} count
	     */
	    setCount: function (count)
	    {
	    	var me = this,
			    findPanel = me.getFindPanel(),
			    countField = findPanel.getCountField();
		    
		    countField.setCount(count);
	    },

        /**
         * Возвращает редактор xml.
         * @return {FBEditor.view.panel.main.xml.Xml}
         */
        getXmlPanel: function ()
        {
            var me = this,
                panel;

            panel = me.xmlPanel || me.up('main-xml');
            me.xmlPanel = panel;

            return panel;
        },
	
	    /**
	     * Возвращает панель поиска по xml.
	     * @return {FBEditor.view.panel.main.xml.search.find.Find}
	     */
	    getFindPanel: function ()
	    {
		    var me = this,
			    panel;
		
		    panel = me.findPanel || me.down('panel-xml-search-find');
		    me.findPanel = panel;
		
		    return panel;
	    },
	
	    /**
	     * Возвращает панель замены по xml.
	     * @return {FBEditor.view.panel.main.xml.search.replace.Replace}
	     */
	    getReplacePanel: function ()
	    {
		    var me = this,
			    panel;
		
		    panel = me.replacePanel || me.down('panel-xml-search-replace');
		    me.replacePanel = panel;
		
		    return panel;
	    },

        /**
         * Возвращает данные для поиска.
         * @return {Object}
         * @return {String} Object.searchText Текст поиска.
         */
        getDataForSearch: function ()
        {
            var me = this,
	            findPanel = me.getFindPanel(),
                searchField = findPanel.getSearchField(),
                regexField = findPanel.getRegexField(),
	            caseField = findPanel.getCaseField(),
	            wordsField = findPanel.getWordsField(),
                data;

            data = {
                searchText: searchField.getValue(),
                isReg: regexField.getValue(),
	            ignoreCase: !caseField.getValue(),
	            words: wordsField.getValue()
            };
            
            //console.log('data', data);

            return data;
        }
    }
);