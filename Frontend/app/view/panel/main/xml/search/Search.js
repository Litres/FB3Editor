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
	        'FBEditor.view.panel.main.xml.search.find.Find'
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
			            }
		            ]
	            },
                {
                    xtype: 'panel-xml-search-close'
                }
            ];

            me.callParent(arguments);
        },

        afterShow: function ()
        {
            var me = this,
	            findPanel = me.getFindPanel(),
                searchField = findPanel.getSearchField();

            // ставим фокус в текстовое поле
            searchField.focus();
            
            // вбрасываем событие для нового поиска
            me.fireEvent('change');

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